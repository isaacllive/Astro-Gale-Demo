import { db, eq, Role } from 'astro:db';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const getRole = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        const resp = await db.select().from(Role).where(eq(Role.id, input.id));
        return { success: true, message: 'Role fetched successfully', data: resp };
    },
});

export const updateRole = defineAction({
    input: z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        const updates: Record<string, unknown> = {
            updatedAt: new Date(),
            updatedBy: 1,
        };
        if (input.name !== undefined) updates.name = input.name;
        if (input.description !== undefined) updates.description = input.description;
        if (input.status !== undefined) updates.status = input.status;

        await db.update(Role).set(updates).where(eq(Role.id, input.id));

        return { success: true, message: 'Role updated successfully' };
    },
});

export const deleteRole = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        await db
            .update(Role)
            .set({
                status: 'deleted',
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(Role.id, input.id));

        return { success: true, message: 'Role deleted successfully' };
    },
});

export const createRole = defineAction({
    input: z.object({
        name: z.string(),
        description: z.string().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.insert(Role).values({
            name: input.name,
            description: input.description ?? null,
            status: input.status || 'active',
            createdAt: new Date(),
            createdBy: 1,
            updatedAt: new Date(),
            updatedBy: 1,
        });

        return { success: true, message: 'Role created successfully' };
    },
});
