import { db, eq, Assignment } from 'astro:db';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const getAssignment = defineAction({
    input: z.object({
        recordId: z.number().optional(),
    }),
    handler: async (input) => {
        const { recordId } = input;
        let resp = (recordId)
            ? await db.select().from(Assignment).where(eq(Assignment.recordId, recordId))
            : await db.select().from(Assignment);

        return { success: true, message: "Assignment fetched successfully", data: resp };
    }
});

export const createAssignment = defineAction({
    input: z.object({
        type: z.string(),
        objectType: z.string(),
        recordId: z.number(),
        childObjectType: z.string(),
        childRecordId: z.number(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        isPrimary: z.boolean().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.insert(Assignment).values({
            type: input.type,
            objectType: input.objectType,
            recordId: input.recordId,
            childObjectType: input.childObjectType,
            childRecordId: input.childRecordId,
            startDate: input.startDate,
            endDate: input.endDate,
            isPrimary: input.isPrimary || true,
            status: input.status || "new",
            createdAt: new Date(),
            createdBy: 1,
            updatedAt: new Date(),
            updatedBy: 1,
        });

        return { success: true, message: "Assignment created successfully" };
    }
});

export const updateAssignment = defineAction({
    input: z.object({
        recordId: z.number(),
        type: z.string().optional(),
        objectType: z.string().optional(),
        childObjectType: z.string().optional(),
        childRecordId: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        isPrimary: z.boolean().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.update(Assignment)
            .set({
                type: input.type,
                objectType: input.objectType,
                childObjectType: input.childObjectType,
                childRecordId: input.childRecordId,
                startDate: input.startDate,
                endDate: input.endDate,
                isPrimary: input.isPrimary,
                status: input.status,
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(Assignment.recordId, input.recordId));

        return { success: true, message: "Assignment updated successfully" };
    }
});

export const deleteAssignment = defineAction({
    input: z.object({
        recordId: z.number(),
    }),
    handler: async (input) => {
        await db.update(Assignment)
            .set({
                status: "deleted",
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(Assignment.recordId, input.recordId));

        return { success: true, message: "Assignment deleted successfully" };
    }
});