import { defineAction } from 'astro:actions';
import { eq, db, User } from 'astro:db';
import { compare } from 'bcryptjs';
import { z } from 'zod';

export const login = defineAction({
    accept: 'form',
    input: z.object({
        username: z.string(),
        password: z.string(),
    }),
    handler: async ({ username, password }, { cookies }) => {
        if (!username || !password) {
            return {
                success: false,
                error: 'Username and password are required',
            };
        }

        try {
            // Find user by username
            const users = await db.select().from(User).where(eq(User.username, username));
            const user = users.length > 0 ? users[0] : null;

            if (!user) {
                return {
                    success: false,
                    error: 'Invalid username or password',
                };
            }

            // Verify password
            const isValidPassword = await compare(password, user.password);

            if (!isValidPassword) {
                return {
                    success: false,
                    error: 'Invalid username or password',
                };
            }

            // Set session cookie
            cookies.set('user-id', user.id.toString(), {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                secure: process.env.NODE_ENV === 'production', // Only secure in production
                httpOnly: true,
                sameSite: 'strict',
            });

            return {
                success: true,
                redirect: '/dashboard'
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'An unexpected error occurred',
            };
        }
    }
}); 