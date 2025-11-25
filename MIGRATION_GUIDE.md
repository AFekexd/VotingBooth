# MySQL to PostgreSQL Migration Guide

This guide will help you migrate your VotingBooth application from MySQL to PostgreSQL.

## Prerequisites

- PostgreSQL installed on your system
- Access to your existing MySQL database (if you have data to migrate)
- Backup of your MySQL database

## Step 1: Install PostgreSQL

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Windows
Download and install from: https://www.postgresql.org/download/windows/

## Step 2: Create PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE voting_booth;
CREATE USER your_username WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE voting_booth TO your_username;

# Grant schema privileges (PostgreSQL 15+)
\c voting_booth
GRANT ALL ON SCHEMA public TO your_username;

# Exit
\q
```

## Step 3: Update Environment Variables

Update your `.env` file with the PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/voting_booth"
```

## Step 4: Generate Prisma Client and Run Migrations

```bash
# Generate Prisma client for PostgreSQL
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# When prompted, name your migration (e.g., "init" or "migrate_to_postgresql")
```

## Step 5: Migrate Existing Data (Optional)

If you have existing data in MySQL that you want to migrate:

### Option A: Manual Export/Import (Recommended for small datasets)

1. **Export data from MySQL:**
```bash
# Export votes
mysql -u username -p voting_booth -e "SELECT * FROM votes" > votes.csv

# Export options
mysql -u username -p voting_booth -e "SELECT * FROM options" > options.csv
```

2. **Import into PostgreSQL:**
```bash
# Connect to PostgreSQL
psql -U your_username -d voting_booth

# Import votes
\copy votes FROM 'votes.csv' WITH (FORMAT csv, HEADER);

# Import options
\copy options FROM 'options.csv' WITH (FORMAT csv, HEADER);
```

### Option B: Using pgloader (Recommended for larger datasets)

```bash
# Install pgloader
sudo apt install pgloader  # Ubuntu/Debian
brew install pgloader      # macOS

# Create migration config file: migration.load
cat > migration.load << EOF
LOAD DATABASE
  FROM mysql://mysql_user:mysql_pass@localhost/voting_booth
  INTO postgresql://pg_user:pg_pass@localhost/voting_booth
  
  WITH include drop, create tables, create indexes, reset sequences
  
  SET maintenance_work_mem to '128MB', work_mem to '12MB'
  
  CAST type datetime to timestamptz drop default drop not null using zero-dates-to-null;
EOF

# Run migration
pgloader migration.load
```

## Step 6: Verify Migration

```bash
# Start Prisma Studio to verify data
npm run prisma:studio

# Check that all tables exist:
# - votes
# - options
# - api_logs (new table)
```

## Step 7: Test the Application

```bash
# Start the server
npm start

# Test health endpoint
curl http://localhost:3000/health

# Test getting all votes
curl http://localhost:3000/api/v1/votes

# Check that API logs are being created in the database
```

## Troubleshooting

### Connection Issues

If you get connection errors:
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check your connection string in `.env`
- Ensure the database and user exist
- Check PostgreSQL authentication settings in `pg_hba.conf`

### Permission Issues

If you get permission errors:
```sql
-- Connect as postgres user
sudo -u postgres psql voting_booth

-- Grant all privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
```

### Migration Errors

If Prisma migrations fail:
```bash
# Reset the database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually drop and recreate
sudo -u postgres psql
DROP DATABASE voting_booth;
CREATE DATABASE voting_booth;
```

## Rollback to MySQL

If you need to rollback:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```bash
DATABASE_URL="mysql://username:password@localhost:3306/voting_booth"
```

3. Regenerate Prisma client:
```bash
npm run prisma:generate
```

## Performance Tuning

For production PostgreSQL deployments:

```sql
-- Increase connection pool
ALTER SYSTEM SET max_connections = 200;

-- Optimize for your workload
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Restart PostgreSQL
sudo systemctl restart postgresql
```

## Next Steps

- Set up automated backups using `pg_dump`
- Configure log rotation for API logs
- Consider implementing log retention policies
- Review privacy compliance for logged data
