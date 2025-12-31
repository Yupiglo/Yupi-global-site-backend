import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllMembers = async (req: Request, res: Response) => {
    try {
        const members = await prisma.member.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};

export const getMemberById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const member = await prisma.member.findUnique({
            where: { id: parseInt(id) },
        });
        if (!member) return res.status(404).json({ error: 'Member not found' });
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch member' });
    }
};

export const createMember = async (req: Request, res: Response) => {
    const { firstName, lastName, email, phone, country, city, company, position, source, status } = req.body;
    try {
        const newMember = await prisma.member.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                country,
                city,
                company,
                position,
                source,
                status: status || 'pending',
            },
        });
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create member' });
    }
};

export const updateMemberStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedMember = await prisma.member.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update member status' });
    }
};

export const deleteMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.member.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete member' });
    }
};
