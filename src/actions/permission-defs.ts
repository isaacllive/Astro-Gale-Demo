import { db, eq, PermissionDef } from 'astro:db';
import { defineAction } from 'astro:actions';
import { selectSchema } from '../shared/schemas';
import { z } from 'astro:schema';
import { PERMISSION_RESOURCE_TYPES } from '../shared/constants';

export const getPermissionDef = defineAction({
    input: selectSchema,
    handler: async (input) => {
        const { id } = input;
        if (id) {
            let resp = await db.select().from(PermissionDef).where(eq(PermissionDef.id, id));
            return { success: true, message: "Permission definition fetched successfully", data: resp };
        }

        let defaults = {
            page: 1,
            pageSize: 10,
        }

        let { page, pageSize } = { ...defaults, ...input };
        let resp = await db.select().from(PermissionDef).limit(pageSize).offset(page * pageSize);
        return {
            success: true,
            message: "Permission definitions fetched successfully",
            data: resp
        };
    }
});

export const createPermissionDef = defineAction({
    input: z.object({
        objectType: z.string(),
        resourceType: z.string(),
        resourceName: z.string(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.insert(PermissionDef).values({
            objectType: input.objectType,
            resourceType: input.resourceType,
            resourceName: input.resourceName,
            description: input.description,
            isActive: input.isActive ?? true,
            status: input.status || "active",
            createdAt: new Date(),
            createdBy: 1,
            updatedAt: new Date(),
            updatedBy: 1,
        });

        return { success: true, message: "Permission definition created successfully" };
    }
});

export const updatePermissionDef = defineAction({
    input: z.object({
        id: z.number(),
        objectType: z.string().optional(),
        resourceType: z.string().optional(),
        resourceName: z.string().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        const updateData: any = {
            updatedAt: new Date(),
            updatedBy: 1,
        };

        if (input.objectType !== undefined) updateData.objectType = input.objectType;
        if (input.resourceType !== undefined) updateData.resourceType = input.resourceType;
        if (input.resourceName !== undefined) updateData.resourceName = input.resourceName;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.isActive !== undefined) updateData.isActive = input.isActive;
        if (input.status !== undefined) updateData.status = input.status;

        await db.update(PermissionDef)
            .set(updateData)
            .where(eq(PermissionDef.id, input.id));

        return { success: true, message: "Permission definition updated successfully" };
    }
});

export const deletePermissionDef = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        await db.update(PermissionDef)
            .set({
                status: "deleted",
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(PermissionDef.id, input.id));

        return { success: true, message: "Permission definition deleted successfully" };
    }
});
