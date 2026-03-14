import { z } from 'astro:schema';

// User schemas
export const selectSchema = z.object({
    id: z.number().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
});
export type SelectSchema = z.infer<typeof selectSchema>;

export const updateUser = z.object({
    id: z.number().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    status: z.string().optional(),
});
export type UpdateUser = z.infer<typeof updateUser>;

export const createUser = z.object({
    username: z.string(),
    password: z.string(),
    status: z.string().optional(),
});
export type CreateUser = z.infer<typeof createUser>;

// Person schemas
export const updatePerson = z.object({
    id: z.number().optional(),
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
});
export type UpdatePerson = z.infer<typeof updatePerson>;

export const createPerson = z.object({
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
});
export type CreatePerson = z.infer<typeof createPerson>;

// Catalog schemas
export const catalog = z.object({
    id: z.number().optional(),
    type: z.number().optional(),
    key: z.string().optional(),
    value: z.string().optional(),
    status: z.string().optional(),
});

export const updateCatalog = z.object({
    id: z.number(),
    key: z.string().optional(),
    value: z.string().optional(),
    status: z.string().optional(),
});
export type UpdateCatalog = z.infer<typeof updateCatalog>;

export const createCatalog = z.object({
    type: z.number(),
    key: z.string(),
    value: z.string(),
    status: z.string().optional(),
});
export type CreateCatalog = z.infer<typeof createCatalog>;

// Assignment schemas
export const assignment = z.object({
    recordId: z.number().optional(),
    type: z.string().optional(),
    objectType: z.string().optional(),
    childObjectType: z.string().optional(),
    childRecordId: z.number().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    isPrimary: z.boolean().optional(),
    status: z.string().optional(),
});

export const updateAssignment = z.object({
    recordId: z.number().optional(),
    type: z.string().optional(),
    objectType: z.string().optional(),
    childObjectType: z.string().optional(),
    childRecordId: z.number().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    isPrimary: z.boolean().optional(),
    status: z.string().optional(),
});
export type UpdateAssignment = z.infer<typeof updateAssignment>;

export const createAssignment = z.object({
    type: z.string(),
    objectType: z.string(),
    recordId: z.number(),
    childObjectType: z.string(),
    childRecordId: z.number(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    isPrimary: z.boolean().optional(),
    status: z.string().optional(),
});
export type CreateAssignment = z.infer<typeof createAssignment>;

// Role schemas
export const updateRole = z.object({
    id: z.number(),
    name: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
});
export type UpdateRole = z.infer<typeof updateRole>;

export const createRole = z.object({
    name: z.string(),
    description: z.string().optional(),
    status: z.string().optional(),
});
export type CreateRole = z.infer<typeof createRole>;

// Permission schemas
export const permission = z.object({
    id: z.number().optional(),
    userId: z.number().optional(),
    objectType: z.string().optional(),
    recordId: z.number().optional(),
    recordStatus: z.string().optional(),
    canCreate: z.boolean().optional(),
    canRead: z.boolean().optional(),
    canUpdate: z.boolean().optional(),
    canDelete: z.boolean().optional(),
    canExecute: z.boolean().optional(),
    status: z.string().optional(),
});

export const updatePermission = z.object({
    id: z.number().optional(),
    userId: z.number().optional(),
    objectType: z.string().optional(),
    recordId: z.number().optional(),
    recordStatus: z.string().optional(),
    canCreate: z.boolean().optional(),
    canRead: z.boolean().optional(),
    canUpdate: z.boolean().optional(),
    canDelete: z.boolean().optional(),
    canExecute: z.boolean().optional(),
    status: z.string().optional(),
});
export type UpdatePermission = z.infer<typeof updatePermission>;

export const createPermission = z.object({
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
});
export type CreatePermission = z.infer<typeof createPermission>;


