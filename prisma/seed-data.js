const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Pages
    const pages = [
        { title: "Accueil", slug: "home", status: "published" },
        { title: "À Propos", slug: "about", status: "published" },
        { title: "Services", slug: "services", status: "published" },
        { title: "Portfolio", slug: "portfolio", status: "published" },
        { title: "Contact", slug: "contact", status: "published" },
        { title: "Actualités", slug: "news", status: "published" },
        { title: "Santé Premium", slug: "health-premium", status: "published" }
    ];

    // 2. Services
    const services = [
        { title: "Produits Premium", slug: "produits-premium", description: "Solutions ayurvédiques certifiées.", icon: "Heart", status: "published" },
        { title: "Marketing Relationnel", slug: "marketing-relationnel", description: "Développez votre entreprise par le partage.", icon: "Users", status: "published" },
        { title: "Liberté & Stabilité", slug: "liberte-stabilite", description: "Plan de compensation généreux.", icon: "TrendingUp", status: "published" },
        { title: "Mentorat de Réussite", slug: "mentorat-reussite", description: "Formation continue pour leaders.", icon: "Award", status: "published" },
        { title: "Outils de Croissance", slug: "outils-croissance", description: "Bureau virtuel et outils marketing.", icon: "Smartphone", status: "published" },
        { title: "Conciergerie Business", slug: "conciergerie-business", description: "Accompagnement VIP pour entrepreneurs.", icon: "Star", status: "published" }
    ];

    // 3. Portfolio
    const portfolio = [
        { title: "Leadership Summit 2024", slug: "leadership-summit-2024", category: "Événement", status: "published" },
        { title: "Wellness & Wealth Expo", slug: "wellness-wealth-expo", category: "Événement", status: "published" },
        { title: "Prix de l'Innovation Sociale", slug: "prix-innovation-sociale", category: "Distinction", status: "published" },
        { title: "Meilleur Partenaire MLM", slug: "meilleur-partenaire-mlm", category: "Distinction", status: "published" }
    ];

    // 4. Posts (Articles/Actualités)
    const posts = [
        { title: "Succès éclatant de la Convention de Cotonou", slug: "convention-cotonou", status: "published" },
        { title: "Les Secrets de l'Artemisia", slug: "secrets-artemisia", status: "published" },
        { title: "Nouvelle Gamme Ayurvédique : Yuvi Herbal", slug: "yuvi-herbal-launch", status: "published" }
    ];

    console.log('🌱 Full Seeding start...');

    // Seed Pages
    for (const p of pages) {
        await prisma.page.upsert({ where: { slug: p.slug }, update: p, create: p });
    }
    console.log('✅ Pages seeded');

    // Seed Services
    for (const s of services) {
        await prisma.service.upsert({ where: { slug: s.slug }, update: s, create: s });
    }
    console.log('✅ Services seeded');

    // Seed Portfolio
    for (const p of portfolio) {
        await prisma.portfolio.upsert({ where: { slug: p.slug }, update: p, create: p });
    }
    console.log('✅ Portfolio seeded');

    // Seed Posts
    for (const p of posts) {
        await prisma.post.upsert({ where: { slug: p.slug }, update: p, create: p });
    }
    console.log('✅ Posts seeded');

    console.log('✨ Full Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
