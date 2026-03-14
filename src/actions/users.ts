import { db, eq, User } from 'astro:db';
import { defineAction } from 'astro:actions';
import { selectSchema } from '../shared/schemas';
import { z } from 'astro:schema';

export const getUser = defineAction({
    input: selectSchema,
    handler: async (input) => {

        const { id } = input;
        if (id) {
            let resp = await db.select().from(User).where(eq(User.id, id))
            return { success: true, message: "User fetched successfully", data: resp };
        }

        let defaults = {
            page: 1,
            pageSize: 10,
        }

        let { page, pageSize } = { ...defaults, ...input };
        let resp = await db.select().from(User).limit(pageSize).offset(page * pageSize);
        return {
            success: true,
            message: "User fetched successfully",
            data: resp
        };
    }
});

export const updateUser = defineAction({
    input: z.object({
        id: z.number(),
        username: z.string().optional(),
        password: z.string().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        const updates: Record<string, any> = {
            updatedAt: new Date(),
            updatedBy: 1,
        };
        if (input.username !== undefined) updates.username = input.username;
        if (input.password !== undefined && input.password !== '') updates.password = input.password;
        if (input.status !== undefined) updates.status = input.status;

        await db.update(User)
            .set(updates)
            .where(eq(User.id, input.id));

        return { success: true, message: "User updated successfully" };
    }
});

export const deleteUser = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        await db.update(User)
            .set({
                status: "deleted",
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(User.id, input.id));

        return { success: true, message: "User deleted successfully" };
    }
});

export const createUser = defineAction({
    input: z.object({
        username: z.string(),
        password: z.string(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.insert(User).values({
            username: input.username,
            password: input.password,
            status: input.status || "new",
            createdAt: new Date(),
            createdBy: 1,
            updatedAt: new Date(),
            updatedBy: 1,
        });

        return { success: true, message: "User created successfully" };
    }
});

