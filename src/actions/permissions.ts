import { db, eq, Permision } from 'astro:db';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const getPermission = defineAction({
    input: z.object({
        id: z.number().optional(),
    }),
    handler: async (input) => {
        const { id } = input;
        let resp = (id)
            ? await db.select().from(Permision).where(eq(Permision.id, id))
            : await db.select().from(Permision);

        return { success: true, message: "Permission fetched successfully", data: resp };
    }
});

export const createPermission = defineAction({
    input: z.object({
        userId: z.number(),
        objectType: z.string(),
        recordId: z.number(),
        recordStatus: z.string(),
        canCreate: z.boolean().optional(),
        canRead: z.boolean().optional(),
        canUpdate: z.boolean().optional(),
        canDelete: z.boolean().optional(),
        canExecute: z.boolean().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.insert(Permision).values({
            userId: input.userId,
            objectType: input.objectType,
            recordId: input.recordId,
            recordStatus: input.recordStatus,
            canCreate: input.canCreate || false,
            canRead: input.canRead || false,
            canUpdate: input.canUpdate || false,
            canDelete: input.canDelete || false,
            canExecute: input.canExecute || false,
            status: input.status || "new",
            createdAt: new Date(),
            createdBy: 1,
            updatedAt: new Date(),
            updatedBy: 1,
        });

        return { success: true, message: "Permission created successfully" };
    }
});

export const updatePermission = defineAction({
    input: z.object({
        id: z.number(),
        canCreate: z.boolean().optional(),
        canRead: z.boolean().optional(),
        canUpdate: z.boolean().optional(),
        canDelete: z.boolean().optional(),
        canExecute: z.boolean().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.update(Permision)
            .set({
                canCreate: input.canCreate,
                canRead: input.canRead,
                canUpdate: input.canUpdate,
                canDelete: input.canDelete,
                canExecute: input.canExecute,
                status: input.status,
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(Permision.id, input.id));

        return { success: true, message: "Permission updated successfully" };
    }
});

export const deletePermission = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        await db.update(Permision)
            .set({
                status: "deleted",
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(Permision.id, input.id));

        return { success: true, message: "Permission deleted successfully" };
    }
});