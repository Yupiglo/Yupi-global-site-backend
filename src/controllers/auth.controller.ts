import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'yupi-secret-key-development';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};

export const getMe = async (req: Request, res: Response) => {
    // @ts-ignore - admin is added by middleware
    const adminId = req.admin?.id;

    try {
        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: { id: true, username: true, email: true, role: true }
        });

        if (!admin) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
