import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { featuredImage: true },
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const service = await prisma.service.findUnique({
            where: { slug },
            include: { featuredImage: true },
        });
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch service' });
    }
};

export const createService = async (req: Request, res: Response) => {
    const { title, slug, description, icon, featuredImageId, status } = req.body;
    try {
        const newService = await prisma.service.create({
            data: {
                title,
                slug,
                description,
                icon,
                featuredImageId,
                status: status || 'draft',
            },
        });
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create service' });
    }
};

export const updateService = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, slug, description, icon, featuredImageId, status } = req.body;
    try {
        const updatedService = await prisma.service.update({
            where: { id: parseInt(id) },
            data: {
                title,
                slug,
                description,
                icon,
                featuredImageId,
                status,
            },
        });
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update service' });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.service.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
};
