import { db, eq, Person } from 'astro:db';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { selectSchema } from '../shared/schemas';

export const getPerson = defineAction({
    input: selectSchema,
    handler: async (input) => {
        const { id } = input;
        let resp = (id)
            ? await db.select().from(Person).where(eq(Person.id, id))
            : await db.select({}).from(Person);

        return { success: true, message: "Person fetched successfully", data: resp };
    }
});

export const updatePerson = defineAction({
    input: z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
        dateOfBirth: z.date().optional(),
        gender: z.string().optional(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.update(Person)
            .set({
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                phone: input.phone,
                address: input.address,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode,
                country: input.country,
                dateOfBirth: input.dateOfBirth,
                gender: input.gender,
                status: input.status,
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(Person.id, input.id));

        return { success: true, message: "Person updated successfully" };
    }
});

export const deletePerson = defineAction({
    input: z.object({
        id: z.number(),
    }),
    handler: async (input) => {
        await db.update(Person)
            .set({
                status: "deleted",
                updatedAt: new Date(),
                updatedBy: 1,
            })
            .where(eq(Person.id, input.id));

        return { success: true, message: "Person deleted successfully" };
    }
});

export const createPerson = defineAction({
    input: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        phone: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string(),
        dateOfBirth: z.date(),
        gender: z.string(),
        status: z.string().optional(),
    }),
    handler: async (input) => {
        await db.insert(Person).values({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            address: input.address,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            country: input.country,
            dateOfBirth: input.dateOfBirth,
            gender: input.gender,
            status: input.status || "new",
            createdAt: new Date(),
            createdBy: 1,
            updatedAt: new Date(),
            updatedBy: 1,
        });

        return { success: true, message: "Person created successfully" };
    }
});