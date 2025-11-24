import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.option.deleteMany();
    await prisma.vote.deleteMany();

    // Seed Vote 1: Programming Languages
    console.log('Creating vote: Favorite Programming Language');
    const vote1 = await prisma.vote.create({
        data: {
            title: 'What is your favorite programming language?',
            description: 'Vote for the programming language you use most and enjoy working with.',
            isActive: true,
            options: {
                create: [
                    { optionText: 'JavaScript', voteCount: 45 },
                    { optionText: 'Python', voteCount: 60 },
                    { optionText: 'Java', voteCount: 30 },
                    { optionText: 'TypeScript', voteCount: 38 },
                    { optionText: 'Go', voteCount: 22 },
                    { optionText: 'Rust', voteCount: 15 }
                ]
            }
        },
        include: {
            options: true
        }
    });

    // Seed Vote 2: Web Frameworks
    console.log('Creating vote: Best Web Framework');
    const vote2 = await prisma.vote.create({
        data: {
            title: 'Best JavaScript Framework in 2024?',
            description: 'Which framework do you prefer for building modern web applications?',
            isActive: true,
            options: {
                create: [
                    { optionText: 'React', voteCount: 85 },
                    { optionText: 'Vue.js', voteCount: 42 },
                    { optionText: 'Angular', voteCount: 28 },
                    { optionText: 'Svelte', voteCount: 35 },
                    { optionText: 'Next.js', voteCount: 50 }
                ]
            }
        },
        include: {
            options: true
        }
    });

    // Seed Vote 3: Database Preferences
    console.log('Creating vote: Database Preference');
    const vote3 = await prisma.vote.create({
        data: {
            title: 'Preferred Database System?',
            description: 'What database do you use for your projects?',
            isActive: true,
            options: {
                create: [
                    { optionText: 'PostgreSQL', voteCount: 55 },
                    { optionText: 'MySQL', voteCount: 48 },
                    { optionText: 'MongoDB', voteCount: 62 },
                    { optionText: 'SQLite', voteCount: 18 },
                    { optionText: 'Redis', voteCount: 25 }
                ]
            }
        },
        include: {
            options: true
        }
    });

    // Seed Vote 4: Code Editor (Closed Vote)
    console.log('Creating vote: Code Editor (Closed)');
    const vote4 = await prisma.vote.create({
        data: {
            title: 'Your Favorite Code Editor?',
            description: 'This poll has been closed.',
            isActive: false,
            closedAt: new Date('2024-01-15'),
            options: {
                create: [
                    { optionText: 'VS Code', voteCount: 120 },
                    { optionText: 'IntelliJ IDEA', voteCount: 35 },
                    { optionText: 'Vim', voteCount: 28 },
                    { optionText: 'Sublime Text', voteCount: 15 },
                    { optionText: 'Atom', voteCount: 8 }
                ]
            }
        },
        include: {
            options: true
        }
    });

    // Seed Vote 5: Operating System
    console.log('Creating vote: Operating System');
    const vote5 = await prisma.vote.create({
        data: {
            title: 'Which OS do you use for development?',
            description: 'Vote for your primary development operating system.',
            isActive: true,
            options: {
                create: [
                    { optionText: 'Windows', voteCount: 65 },
                    { optionText: 'macOS', voteCount: 58 },
                    { optionText: 'Linux (Ubuntu)', voteCount: 42 },
                    { optionText: 'Linux (Arch)', voteCount: 18 },
                    { optionText: 'WSL on Windows', voteCount: 35 }
                ]
            }
        },
        include: {
            options: true
        }
    });

    console.log('✅ Seeding completed successfully!');
    console.log(`Created ${5} votes with their options.`);
    console.log('\nSummary:');
    console.log(`- Vote 1: ${vote1.title} (${vote1.options.length} options)`);
    console.log(`- Vote 2: ${vote2.title} (${vote2.options.length} options)`);
    console.log(`- Vote 3: ${vote3.title} (${vote3.options.length} options)`);
    console.log(`- Vote 4: ${vote4.title} (${vote4.options.length} options) - CLOSED`);
    console.log(`- Vote 5: ${vote5.title} (${vote5.options.length} options)`);
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
