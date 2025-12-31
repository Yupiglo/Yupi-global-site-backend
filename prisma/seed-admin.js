const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@yupiglobal.net';
    const username = email; // Allow logging in with email address
    const password = 'YupiGlo@2026'; // Requested by user
    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const admin = await prisma.admin.upsert({
            where: { email },
            update: {
                username,
                passwordHash
            },
            create: {
                username,
                email,
                passwordHash,
                role: 'admin',
            },
        });

        console.log('✅ Admin user created/verified:', admin.username);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
