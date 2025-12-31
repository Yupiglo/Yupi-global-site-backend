import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPortfolioItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.portfolio.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { featuredImage: true },
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio items' });
    }
};

export const getPortfolioBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const item = await prisma.portfolio.findUnique({
            where: { slug },
            include: { featuredImage: true },
        });
        if (!item) return res.status(404).json({ error: 'Portfolio item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio item' });
    }
};

export const createPortfolioItem = async (req: Request, res: Response) => {
    const { title, slug, description, featuredImageId, category, status } = req.body;
    try {
        const newItem = await prisma.portfolio.create({
            data: {
                title,
                slug,
                description,
                featuredImageId,
                category,
                status: status || 'draft',
            },
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create portfolio item' });
    }
};

export const updatePortfolioItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, slug, description, featuredImageId, category, status } = req.body;
    try {
        const updatedItem = await prisma.portfolio.update({
            where: { id: parseInt(id) },
            data: {
                title,
                slug,
                description,
                featuredImageId,
                category,
                status,
            },
        });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update portfolio item' });
    }
};

export const deletePortfolioItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.portfolio.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete portfolio item' });
    }
};
