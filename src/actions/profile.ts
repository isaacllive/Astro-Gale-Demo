import { defineAction } from 'astro:actions';
import { db, eq, User, Person, Assignment, and } from 'astro:db';
import { hash, compare } from 'bcryptjs';
import { z } from 'astro:schema';
import { OBJECT_TYPES } from '../shared/constants';

export const getProfile = defineAction({
    input: z.object({
        userId: z.number(),
    }),
    handler: async (input) => {
        const { userId } = input;

        // Get user
        const users = await db.select().from(User).where(eq(User.id, userId));
        if (users.length === 0) {
            return { success: false, error: 'User not found' };
        }

        const user = users[0];

        // Try to find linked Person via Assignment
        const assignments = await db.select()
            .from(Assignment)
            .where(
                and(
                    eq(Assignment.objectType, OBJECT_TYPES.USER.key),
                    eq(Assignment.recordId, userId),
                    eq(Assignment.childObjectType, OBJECT_TYPES.PERSON.key)
                )
            );

        let person = null;
        if (assignments.length > 0) {
            const primaryAssignment = assignments.find(a => a.isPrimary) || assignments[0];
            const persons = await db.select()
                .from(Person)
                .where(eq(Person.id, primaryAssignment.childRecordId));
            if (persons.length > 0) {
                person = persons[0];
            }
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return {
            success: true,
            data: {
                user: userWithoutPassword,
                person: person,
            }
        };
    }
});

export const updateProfile = defineAction({
    input: z.object({
        userId: z.number(),
        username: z.string().optional(),
        darkMode: z.boolean().optional(),
    }),
    handler: async (input, { cookies }) => {
        const { userId, username, darkMode } = input;

        // Check if username is being changed and if it's already taken
        if (username) {
            const existingUsers = await db.select()
                .from(User)
                .where(eq(User.username, username));
            if (existingUsers.length > 0 && existingUsers[0].id !== userId) {
                return {
                    success: false,
                    error: 'Username already exists'
                };
            }
        }

        const updateData: any = {
            updatedAt: new Date(),
            updatedBy: userId,
        };

        if (username) {
            updateData.username = username;
        }
        if (typeof darkMode === 'boolean') {
            updateData.darkMode = darkMode;
        }

        await db.update(User)
            .set(updateData)
            .where(eq(User.id, userId));

        // Update theme cookie when dark mode preference changes
        if (typeof darkMode === 'boolean' && cookies) {
            cookies.set('theme', darkMode ? 'dark' : 'light', {
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'strict',
            });
        }

        return { success: true, message: 'Profile updated successfully', data: { darkMode } };
    }
});

export const changePassword = defineAction({
    input: z.object({
        userId: z.number(),
        currentPassword: z.string(),
        newPassword: z.string().min(6),
    }),
    handler: async (input) => {
        const { userId, currentPassword, newPassword } = input;

        // Get user
        const users = await db.select().from(User).where(eq(User.id, userId));
        if (users.length === 0) {
            return { success: false, error: 'User not found' };
        }

        const user = users[0];

        // Verify current password
        const isValidPassword = await compare(currentPassword, user.password);
        if (!isValidPassword) {
            return {
                success: false,
                error: 'Current password is incorrect'
            };
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 10);

        // Update password
        await db.update(User)
            .set({
                password: hashedPassword,
                updatedAt: new Date(),
                updatedBy: userId,
            })
            .where(eq(User.id, userId));

        return { success: true, message: 'Password changed successfully' };
    }
});
