import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { featuredImage: true, author: { select: { id: true, username: true, email: true } } },
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

export const getPostBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { slug },
            include: { featuredImage: true, author: { select: { id: true, username: true, email: true } } },
        });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    const { title, slug, content, excerpt, featuredImageId, status, authorId, publishedAt } = req.body;
    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                featuredImageId,
                status: status || 'draft',
                authorId,
                publishedAt: publishedAt ? new Date(publishedAt) : null,
            },
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, slug, content, excerpt, featuredImageId, status, authorId, publishedAt } = req.body;
    try {
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                title,
                slug,
                content,
                excerpt,
                featuredImageId,
                status,
                authorId,
                publishedAt: publishedAt ? new Date(publishedAt) : null,
            },
        });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.post.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};
