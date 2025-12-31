const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// Fonction pour déterminer la catégorie d'un média
function getMediaCategory(filePath, filename) {
    const lowerPath = filePath.toLowerCase();
    const lowerName = filename.toLowerCase();
    
    // Services (priorité haute - dossier dédié)
    if (lowerPath.includes('services/') || lowerName.includes('service') ||
        lowerName.includes('health_premium') || lowerName.includes('marketing_community') ||
        lowerName.includes('digital_innovation') || lowerName.includes('financial_stability') ||
        lowerName.includes('leadership_mentorship') || lowerName.includes('vip_concierge')) {
        return 'services';
    }
    
    // Blog/Articles/News
    if (lowerPath.includes('blog') || lowerPath.includes('article') || 
        lowerPath.includes('news') || lowerName.includes('blog') || 
        lowerName.includes('h2-blog') || lowerName.includes('article') ||
        lowerName.includes('bg-section-blog')) {
        return 'blog';
    }
    
    // Portfolio/Projets
    if (lowerPath.includes('portfolio') || lowerPath.includes('project') || 
        lowerName.includes('portfolio') || lowerName.includes('project') ||
        lowerName.includes('demo') || (lowerName.includes('slider') && !lowerName.includes('bg-section'))) {
        return 'portfolio';
    }
    
    // Produits
    if (lowerName.includes('product') || lowerName.includes('produit') ||
        lowerName.includes('sea-buckthorn') || lowerName.includes('artemisia') ||
        lowerName.includes('yuvi') || lowerName.includes('herbal') ||
        lowerName.includes('detox') || lowerName.includes('diabo') ||
        lowerName.includes('immuno') || lowerName.includes('women-care') ||
        lowerName.includes('men-power')) {
        return 'products';
    }
    
    // Événements
    if (lowerPath.includes('event') || lowerName.includes('event') ||
        lowerName.includes('convention') || lowerName.includes('summit') ||
        lowerName.includes('expo') || lowerName.includes('meeting') ||
        lowerName.includes('conference')) {
        return 'events';
    }
    
    // Témoignages/Testimonials
    if (lowerName.includes('testimonial') || lowerName.includes('temoignage') ||
        lowerName.includes('avatar') || lowerName.includes('client')) {
        return 'testimonials';
    }
    
    // Thème/Design (éléments UI)
    if (lowerName.includes('theme') || lowerName.includes('shape') ||
        lowerName.includes('footer') || lowerName.includes('header') ||
        (lowerName.includes('slider') && lowerName.includes('bg-section')) ||
        lowerName.includes('bg-') || lowerName.includes('icon')) {
        return 'theme';
    }
    
    // Documents/PDF
    if (lowerName.includes('page-') || lowerName.includes('document') ||
        lowerName.includes('.pdf') || lowerPath.includes('2025/03') && lowerName.includes('yupi-EN')) {
        return 'documents';
    }
    
    // Général par défaut
    return 'general';
}

// Fonction pour obtenir le type MIME
function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.webp': 'image/webp',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.pdf': 'application/pdf'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

// Fonction pour générer un alt text descriptif
function generateAltText(filename, category) {
    const name = filename.replace(/\.[^/.]+$/, ''); // Enlever l'extension
    const cleanName = name
        .replace(/[-_]/g, ' ')
        .replace(/\d+x\d+/g, '') // Enlever les dimensions
        .replace(/\b\d+\b/g, '') // Enlever les chiffres isolés
        .trim();
    
    const categoryNames = {
        'services': 'Service Yupi Global',
        'blog': 'Article Yupi Global',
        'portfolio': 'Projet Yupi Global',
        'products': 'Produit Yupi Global',
        'events': 'Événement Yupi Global',
        'testimonials': 'Témoignage Yupi Global',
        'theme': 'Élément graphique Yupi Global',
        'documents': 'Document Yupi Global',
        'general': 'Image Yupi Global'
    };
    
    return cleanName ? `${cleanName} - ${categoryNames[category]}` : categoryNames[category];
}

async function main() {
    console.log('🌱 Seeding Media start...');
    
    const mediaDir = path.join(__dirname, '../../frontend/public/media');
    
    if (!fs.existsSync(mediaDir)) {
        console.error('❌ Media directory not found:', mediaDir);
        process.exit(1);
    }
    
    // Fonction récursive pour scanner les fichiers
    function scanDirectory(dir, basePath = '') {
        const files = [];
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const relativePath = path.join(basePath, item).replace(/\\/g, '/');
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Ignorer certains dossiers
                if (item !== 'node_modules' && item !== '.git') {
                    files.push(...scanDirectory(fullPath, relativePath));
                }
            } else {
                // Filtrer les fichiers image/vidéo
                const ext = path.extname(item).toLowerCase();
                if (['.webp', '.jpg', '.jpeg', '.png', '.gif', '.mp4'].includes(ext)) {
                    // Ignorer les thumbnails (fichiers avec dimensions dans le nom)
                    if (!/\d+x\d+/.test(item) || item.includes('services')) {
                        files.push({
                            filename: item,
                            path: relativePath,
                            fullPath: fullPath,
                            size: stat.size,
                            mimeType: getMimeType(item),
                            category: getMediaCategory(relativePath, item),
                            altText: generateAltText(item, getMediaCategory(relativePath, item))
                        });
                    }
                }
            }
        }
        
        return files;
    }
    
    const mediaFiles = scanDirectory(mediaDir);
    console.log(`📁 Found ${mediaFiles.length} media files to process`);
    
    // Grouper par catégorie pour affichage
    const byCategory = {};
    mediaFiles.forEach(file => {
        if (!byCategory[file.category]) {
            byCategory[file.category] = [];
        }
        byCategory[file.category].push(file);
    });
    
    console.log('\n📊 Media by category:');
    Object.keys(byCategory).sort().forEach(cat => {
        console.log(`  ${cat}: ${byCategory[cat].length} files`);
    });
    
    // Insérer dans la base de données
    let created = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const file of mediaFiles) {
        try {
            // URL relative depuis /media
            const url = `/media/${file.path}`;
            
            // Vérifier si le média existe déjà
            const existing = await prisma.media.findFirst({
                where: { url: url }
            });
            
            if (existing) {
                skipped++;
                continue;
            }
            
            // Créer le média
            await prisma.media.create({
                data: {
                    filename: file.filename,
                    originalFilename: file.filename,
                    mimeType: file.mimeType,
                    size: file.size,
                    url: url,
                    altText: `${file.altText} [${file.category}]`
                }
            });
            
            created++;
            
            if (created % 100 === 0) {
                console.log(`  ✅ Processed ${created} media files...`);
            }
        } catch (error) {
            console.error(`  ❌ Error processing ${file.path}:`, error.message);
            errors++;
        }
    }
    
    console.log('\n✨ Media Seeding completed!');
    console.log(`  ✅ Created: ${created}`);
    console.log(`  ⏭️  Skipped (already exists): ${skipped}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log(`  📊 Total: ${mediaFiles.length}`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

