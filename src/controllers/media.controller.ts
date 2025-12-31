import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllMedia = async (req: Request, res: Response) => {
    try {
        const media = await prisma.media.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch media' });
    }
};

export const createMedia = async (req: Request, res: Response) => {
    const { filename, originalFilename, mimeType, size, url, altText } = req.body;
    try {
        const newMedia = await prisma.media.create({
            data: {
                filename,
                originalFilename,
                mimeType,
                size,
                url,
                altText,
            },
        });
        res.status(201).json(newMedia);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create media' });
    }
};

export const deleteMedia = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Vérifier si le média existe
        const media = await prisma.media.findUnique({
            where: { id: parseInt(id) },
        });

        if (!media) {
            return res.status(404).json({ error: 'Média non trouvé' });
        }

        // Supprimer le média
        await prisma.media.delete({
            where: { id: parseInt(id) },
        });
        
        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting media:', error);
        
        // Gérer les erreurs Prisma spécifiques
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Média non trouvé' });
        }
        
        res.status(500).json({ error: 'Erreur lors de la suppression du média' });
    }
};
