const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pages = [
        {
            title: "Accueil",
            slug: "home",
            content: "Contenu de la page d'accueil...",
            excerpt: "Bienvenue sur Yupi Global",
            status: "published"
        },
        {
            title: "À Propos",
            slug: "about",
            content: "Contenu de la page à propos...",
            excerpt: "Découvrez notre histoire et nos valeurs",
            status: "published"
        },
        {
            title: "Services",
            slug: "services",
            content: "Découvrez nos services premium...",
            excerpt: "Nos solutions pour votre santé et votre bien-être",
            status: "published"
        },
        {
            title: "Portfolio",
            slug: "portfolio",
            content: "Nos réalisations et projets...",
            excerpt: "Découvrez nos succès",
            status: "published"
        },
        {
            title: "Contact",
            slug: "contact",
            content: "Restez en contact avec nous...",
            excerpt: "Nous sommes à votre écoute",
            status: "published"
        },
        {
            title: "Actualités",
            slug: "news",
            content: "Découvrez les dernières actualités de Yupi Global...",
            excerpt: "Blog et articles",
            status: "published"
        },
        {
            title: "Santé Premium",
            slug: "health-premium",
            content: "Nos programmes de santé premium...",
            excerpt: "Optimisez votre santé",
            status: "published"
        }
    ];

    console.log('🌱 Seeding pages...');

    for (const page of pages) {
        await prisma.page.upsert({
            where: { slug: page.slug },
            update: page,
            create: page,
        });
        console.log(`✅ Page seeded: ${page.title}`);
    }

    console.log('✨ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
