import { defineDb, defineTable, column, NOW } from 'astro:db';

const sharedColumns = {
  status: column.text({ optional: true }),
  createdAt: column.date({ default: NOW, optional: true }),
  createdBy: column.number(),
  updatedAt: column.date({ default: NOW, optional: true }),
  updatedBy: column.number(),
}

const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true, }),
    username: column.text({ unique: true }),
    password: column.text(),
    lastLogin: column.date({ optional: true }),
    darkMode: column.boolean({ default: false, optional: true }),
    ...sharedColumns
  }
});

const Person = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    firstName: column.text(),
    lastName: column.text(),
    email: column.text(),
    phone: column.text(),
    address: column.text(),
    city: column.text(),
    state: column.text(),
    zipCode: column.text(),
    country: column.text(),
    dateOfBirth: column.date({}),
    gender: column.text(),
    ...sharedColumns
  }
});

const Catalog = defineTable({
  columns: {
    id: column.number({ primaryKey: true, }),
    type: column.number(),
    key: column.text(),
    value: column.text(),
    ...sharedColumns
  }
});

const Assignment = defineTable({
  columns: {
    id: column.number({ primaryKey: true, }),
    type: column.text(),
    objectType: column.text(),
    recordId: column.number(),
    childObjectType: column.text(),
    childRecordId: column.number(),
    startDate: column.date({ optional: true }),
    endDate: column.date({ optional: true }),
    isPrimary: column.boolean({ default: true }),
    ...sharedColumns
  }
});

const Permision = defineTable({
  columns: {
    id: column.number({ primaryKey: true, }),
    userId: column.number(),
    objectType: column.text(),
    recordId: column.number(),
    recordStatus: column.text(),
    canCreate: column.boolean({ default: false }),
    canRead: column.boolean({ default: false }),
    canUpdate: column.boolean({ default: false }),
    canDelete: column.boolean({ default: false }),
    canExecute: column.boolean({ default: false }),
    ...sharedColumns
  }
});

const File = defineTable({
  columns: {
    id: column.number({ primaryKey: true, }),
    name: column.text({ unique: true }),
    description: column.boolean(),
    fileType: column.text(),
    mimeType: column.text(),
    ...sharedColumns
  }
});

const FileContent = defineTable({
  columns: {
    id: column.number({ primaryKey: true, }),
    FileId: column.number(),
    description: column.boolean(),
    filePath: column.text(),
    storageLocation: column.text(),
    storageProvider: column.text(),
    checksum: column.text(),
    isPrimary: column.boolean(),
    ...sharedColumns
  }
});

const Notification = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    userId: column.number(),
    title: column.text(),
    message: column.text(),
    type: column.text({ optional: true }), // 'info', 'success', 'warning', 'error'
    isRead: column.boolean({ default: false }),
    link: column.text({ optional: true }), // Optional link to related page
    ...sharedColumns
  }
});

const PermissionDef = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    objectType: column.text(), // Domain object (USERS, REPORTS, SOLICITUDES)
    resourceType: column.text(), // Surface/type (ACTION, API, SCREEN, JOB)
    resourceName: column.text(), // Operation (getusers, deleteall, view)
    description: column.text({ optional: true }),
    isActive: column.boolean({ default: true }),
    ...sharedColumns
  }
});

const PermissionAssigned = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    permissionDefId: column.number(), // FK -> PermissionDef.id
    subjectType: column.text(), // enum: USER, ROLE, GROUP, SYSTEM
    subjectId: column.number({ optional: true }), // bigint | null
    effect: column.text(), // enum: ALLOW, DENY
    priority: column.number({ default: 0 }), // int
    ...sharedColumns
  }
});

const Role = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text({ unique: true }),
    description: column.text({ optional: true }),
    ...sharedColumns
  }
});

const ServiceRequest = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    description: column.text({ optional: true }),
    type: column.text({ optional: true }), // e.g. support, maintenance, general
    priority: column.text({ optional: true }), // low, medium, high, urgent
    requesterId: column.number(), // FK -> Person
    assignedToId: column.number({ optional: true }), // FK -> User
    dueDate: column.date({ optional: true }),
    ...sharedColumns
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: { User, Person, Catalog, Assignment, Permision, File, FileContent, Notification, PermissionDef, PermissionAssigned, Role, ServiceRequest }
});

