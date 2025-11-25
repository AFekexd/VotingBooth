import prisma from '../config/database.js';

/**
 * Middleware to log all API requests to the database
 * Captures IP address, headers, request/response data, and timing
 */
const apiLogger = async (req, res, next) => {
    const startTime = Date.now();

    // Extract IP address (handle proxies)
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim()
        || req.headers['x-real-ip']
        || req.socket.remoteAddress
        || req.connection.remoteAddress
        || 'unknown';

    // Extract user agent
    const userAgent = req.headers['user-agent'] || null;

    // Capture relevant headers (exclude sensitive ones)
    const headers = {
        'content-type': req.headers['content-type'],
        'accept': req.headers['accept'],
        'origin': req.headers['origin'],
        'referer': req.headers['referer'],
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'x-real-ip': req.headers['x-real-ip']
    };

    // Capture request body (if exists)
    const requestBody = req.body && Object.keys(req.body).length > 0 ? req.body : null;

    // Capture query parameters
    const queryParams = Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : null;

    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);
    let responseBody = null;

    // Override res.json to capture response data
    res.json = function (data) {
        responseBody = data;
        return originalJson(data);
    };

    // Store original res.send to intercept response
    const originalSend = res.send.bind(res);

    res.send = function (data) {
        if (!responseBody && data) {
            try {
                responseBody = typeof data === 'string' ? JSON.parse(data) : data;
            } catch (e) {
                responseBody = { raw: data };
            }
        }
        return originalSend(data);
    };

    // Log after response is sent
    res.on('finish', async () => {
        const responseTime = Date.now() - startTime;

        try {
            await prisma.apiLog.create({
                data: {
                    method: req.method,
                    path: req.path || req.url,
                    queryParams,
                    ipAddress: ipAddress.substring(0, 45), // Ensure it fits in VARCHAR(45)
                    userAgent: userAgent?.substring(0, 1000), // Limit length
                    headers,
                    requestBody,
                    responseStatus: res.statusCode,
                    responseBody,
                    responseTime
                }
            });
        } catch (error) {
            // Don't break the API if logging fails
            console.error('Failed to log API request:', error.message);
        }
    });

    next();
};

export default apiLogger;
