import { db, eq, Catalog, NOW } from 'astro:db';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const getCatalog = defineAction({
    input: z.object({
        id: z.number().optional(),
        type: z.number().optional(),
    }),
    handler: async (input) => {
        const { id, type } = input;
        let resp;
        
        if (id) {
            resp = await db.select().from(Catalog).where(eq(Catalog.id, id));
        } else if (type) {
            resp = await db.select().from(Catalog).where(eq(Catalog.type, type));
        } else {
            resp = await db.select().from(Catalog);
        }

        return { success: true, message: "Catalog fetched successfully", data: resp };
    }
});

export const createCatalog = defineAction({
    input: z.object({
        type: z.number(),
        key: z.string(),
        value: z.string(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.insert(Catalog).values({
            type: input.type,
            key: input.key,
            value: input.value,
            status: input.status || "new",
            createdAt: NOW,
            createdBy: 1,
            updatedAt: NOW,
            updatedBy: 1,
        });

        return { success: true, message: "Catalog created successfully" };
    }
});

export const updateCatalog = defineAction({
    input: z.object({
        id: z.number(),
        key: z.string().optional(),
        value: z.string().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.update(Catalog)
            .set({
                key: input.key,
                value: input.value,
                status: input.status,
                updatedAt: NOW,
                updatedBy: 1,
            })
            .where(eq(Catalog.id, input.id));

        return { success: true, message: "Catalog updated successfully" };
    }
});

export const deleteCatalog = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        await db.update(Catalog)
            .set({
                status: "deleted",
                updatedAt: NOW,
                updatedBy: 1,
            })
            .where(eq(Catalog.id, input.id));

        return { success: true, message: "Catalog deleted successfully" };
    }
});
