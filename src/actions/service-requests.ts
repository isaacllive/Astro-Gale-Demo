import { db, eq, ServiceRequest } from 'astro:db';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const getServiceRequest = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        const resp = await db.select().from(ServiceRequest).where(eq(ServiceRequest.id, input.id));
        return { success: true, message: 'Service request fetched successfully', data: resp };
    },
});

export const updateServiceRequest = defineAction({
    input: z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        priority: z.string().optional(),
        requesterId: z.number().optional(),
        assignedToId: z.number().optional(),
        status: z.string().optional(),
        dueDate: z.string().optional(),
    }),
    handler: async (input) => {
        const updates: Record<string, unknown> = {
            updatedAt: new Date(),
            updatedBy: 1,
        };
        if (input.title !== undefined) updates.title = input.title;
        if (input.description !== undefined) updates.description = input.description;
        if (input.type !== undefined) updates.type = input.type;
        if (input.priority !== undefined) updates.priority = input.priority;
        if (input.requesterId !== undefined) updates.requesterId = input.requesterId;
        if (input.assignedToId !== undefined) updates.assignedToId = input.assignedToId;
        if (input.status !== undefined) updates.status = input.status;
        if (input.dueDate !== undefined) updates.dueDate = input.dueDate ? new Date(input.dueDate) : null;

        await db.update(ServiceRequest).set(updates).where(eq(ServiceRequest.id, input.id));

        return { success: true, message: 'Service request updated successfully' };
    },
});

export const deleteServiceRequest = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        await db
            .update(ServiceRequest)
            .set({
                status: 'cancelled',
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(ServiceRequest.id, input.id));

        return { success: true, message: 'Service request cancelled successfully' };
    },
});

export const createServiceRequest = defineAction({
    input: z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.string().optional(),
        priority: z.string().optional(),
        requesterId: z.number(),
        assignedToId: z.number().optional(),
        status: z.string().optional(),
        dueDate: z.string().optional(),
    }),
    handler: async (input) => {
        await db.insert(ServiceRequest).values({
            title: input.title,
            description: input.description ?? null,
            type: input.type ?? null,
            priority: input.priority ?? null,
            requesterId: input.requesterId,
            assignedToId: input.assignedToId ?? null,
            status: input.status || 'pending',
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
            createdAt: new Date(),
            createdBy: 1,
            updatedAt: new Date(),
            updatedBy: 1,
        });

        return { success: true, message: 'Service request created successfully' };
    },
});
