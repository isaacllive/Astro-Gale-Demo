import { db, eq, PermissionAssigned } from 'astro:db';
import { defineAction } from 'astro:actions';
import { selectSchema } from '../shared/schemas';
import { z } from 'astro:schema';
import { PERMISSION_SUBJECT_TYPES, PERMISSION_EFFECTS } from '../shared/constants';

export const getPermissionAssigned = defineAction({
    input: selectSchema,
    handler: async (input) => {
        const { id } = input;
        if (id) {
            let resp = await db.select().from(PermissionAssigned).where(eq(PermissionAssigned.id, id));
            return { success: true, message: "Permission assignment fetched successfully", data: resp };
        }

        let defaults = {
            page: 1,
            pageSize: 10,
        }

        let { page, pageSize } = { ...defaults, ...input };
        let resp = await db.select().from(PermissionAssigned).limit(pageSize).offset(page * pageSize);
        return {
            success: true,
            message: "Permission assignments fetched successfully",
            data: resp
        };
    }
});

export const createPermissionAssigned = defineAction({
    input: z.object({
        permissionDefId: z.number(),
        subjectType: z.string(),
        subjectId: z.number().nullable().optional(),
        effect: z.string(),
        priority: z.number().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.insert(PermissionAssigned).values({
            permissionDefId: input.permissionDefId,
            subjectType: input.subjectType,
            subjectId: input.subjectId ?? null,
            effect: input.effect,
            priority: input.priority ?? 0,
            status: input.status || "active",
            createdAt: new Date(),
            createdBy: 1,
            updatedAt: new Date(),
            updatedBy: 1,
        });

        return { success: true, message: "Permission assignment created successfully" };
    }
});

export const updatePermissionAssigned = defineAction({
    input: z.object({
        id: z.number(),
        permissionDefId: z.number().optional(),
        subjectType: z.string().optional(),
        subjectId: z.number().nullable().optional(),
        effect: z.string().optional(),
        priority: z.number().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        const updateData: any = {
            updatedAt: new Date(),
            updatedBy: 1,
        };

        if (input.permissionDefId !== undefined) updateData.permissionDefId = input.permissionDefId;
        if (input.subjectType !== undefined) updateData.subjectType = input.subjectType;
        if (input.subjectId !== undefined) updateData.subjectId = input.subjectId;
        if (input.effect !== undefined) updateData.effect = input.effect;
        if (input.priority !== undefined) updateData.priority = input.priority;
        if (input.status !== undefined) updateData.status = input.status;

        await db.update(PermissionAssigned)
            .set(updateData)
            .where(eq(PermissionAssigned.id, input.id));

        return { success: true, message: "Permission assignment updated successfully" };
    }
});

export const deletePermissionAssigned = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        await db.update(PermissionAssigned)
            .set({
                status: "deleted",
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(PermissionAssigned.id, input.id));

        return { success: true, message: "Permission assignment deleted successfully" };
    }
});
