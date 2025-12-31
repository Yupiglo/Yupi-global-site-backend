import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPages = async (req: Request, res: Response) => {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { featuredImage: true },
        });
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
};

export const getPageBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const page = await prisma.page.findUnique({
            where: { slug },
            include: { featuredImage: true },
        });
        if (!page) return res.status(404).json({ error: 'Page not found' });
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch page' });
    }
};

export const createPage = async (req: Request, res: Response) => {
    const { title, slug, content, excerpt, featuredImageId, status } = req.body;
    try {
        const newPage = await prisma.page.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                featuredImageId,
                status: status || 'draft',
            },
        });
        res.status(201).json(newPage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create page' });
    }
};

export const updatePage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, slug, content, excerpt, featuredImageId, status } = req.body;
    try {
        const updatedPage = await prisma.page.update({
            where: { id: parseInt(id) },
            data: {
                title,
                slug,
                content,
                excerpt,
                featuredImageId,
                status,
            },
        });
        res.json(updatedPage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update page' });
    }
};

export const deletePage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.page.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete page' });
    }
};
