import { db, User, Person, Catalog, Assignment, Permision, File, FileContent, PermissionDef, PermissionAssigned, NOW, eq, and } from 'astro:db';
import { CATALOG_CONSTANTS, STATUSES, ASSIGNMENT_TYPES, OBJECT_TYPES, FILE_TYPES, STORAGE_LOCATIONS, PERMISSION_SUBJECT_TYPES, PERMISSION_EFFECTS, PERMISSION_RESOURCE_TYPES } from '../src/shared/constants';
import { hash } from 'bcryptjs';

// https://astro.build/db/seed
export default async function seed() {

	const sharedColumns = {
		status: STATUSES.ACTIVE.value,
		createdAt: NOW,
		createdBy: 1,
		updatedAt: NOW,
		updatedBy: 1,
	};

	// Hash default password for all seed users
	const defaultPassword = await hash('password', 10);

	// Insert Users
	await db.insert(User).values([
		{ id: 1, username: 'admin', password: defaultPassword, ...sharedColumns },
		{ id: 2, username: "Isaac", password: defaultPassword, ...sharedColumns },
		{ id: 3, username: "Peter", password: defaultPassword, ...sharedColumns },
		{ id: 4, username: "Kasim", password: defaultPassword, ...sharedColumns },
		{ id: 5, username: "Alice", password: defaultPassword, ...sharedColumns },
		{ id: 6, username: "Bob", password: defaultPassword, ...sharedColumns },
		{ id: 7, username: "Charlie", password: defaultPassword, ...sharedColumns },
		{ id: 8, username: "Diana", password: defaultPassword, ...sharedColumns },
		{ id: 9, username: "Eve", password: defaultPassword, ...sharedColumns },
		{ id: 10, username: "Frank", password: defaultPassword, ...sharedColumns },
	]);

	// Insert Persons
	await db.insert(Person).values([
		{ id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", phone: "1234567890", address: "123 Main St", city: "Metropolis", state: "NY", zipCode: "10001", country: "USA", dateOfBirth: NOW, gender: "Male", ...sharedColumns },
		{ id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "0987654321", address: "456 Elm St", city: "Gotham", state: "CA", zipCode: "90001", country: "USA", dateOfBirth: NOW, gender: "Female", ...sharedColumns },
		{ id: 3, firstName: "Alice", lastName: "Johnson", email: "alice@example.com", phone: "1112223333", address: "789 Oak St", city: "Star City", state: "TX", zipCode: "73301", country: "USA", dateOfBirth: NOW, gender: "Female", ...sharedColumns },
		{ id: 4, firstName: "Bob", lastName: "Brown", email: "bob@example.com", phone: "4445556666", address: "321 Pine St", city: "Central City", state: "FL", zipCode: "32789", country: "USA", dateOfBirth: NOW, gender: "Male", ...sharedColumns },
		{ id: 5, firstName: "Charlie", lastName: "Davis", email: "charlie@example.com", phone: "7778889999", address: "654 Maple St", city: "Coast City", state: "WA", zipCode: "98001", country: "USA", dateOfBirth: NOW, gender: "Male", ...sharedColumns },
		{ id: 6, firstName: "Diana", lastName: "Evans", email: "diana@example.com", phone: "1231231234", address: "987 Birch St", city: "Blüdhaven", state: "IL", zipCode: "60601", country: "USA", dateOfBirth: NOW, gender: "Female", ...sharedColumns },
		{ id: 7, firstName: "Eve", lastName: "Foster", email: "eve@example.com", phone: "4564564567", address: "159 Cedar St", city: "Smallville", state: "KS", zipCode: "67524", country: "USA", dateOfBirth: NOW, gender: "Female", ...sharedColumns },
		{ id: 8, firstName: "Frank", lastName: "Green", email: "frank@example.com", phone: "7897897890", address: "753 Spruce St", city: "Keystone City", state: "PA", zipCode: "19019", country: "USA", dateOfBirth: NOW, gender: "Male", ...sharedColumns },
		{ id: 9, firstName: "Grace", lastName: "Harris", email: "grace@example.com", phone: "3213213210", address: "951 Willow St", city: "Fawcett City", state: "OH", zipCode: "43215", country: "USA", dateOfBirth: NOW, gender: "Female", ...sharedColumns },
		{ id: 10, firstName: "Henry", lastName: "Irwin", email: "henry@example.com", phone: "6546546543", address: "357 Aspen St", city: "Opal City", state: "CO", zipCode: "80014", country: "USA", dateOfBirth: NOW, gender: "Male", ...sharedColumns },
	]);

	// Seed Catalog Constants
	for (const entry of CATALOG_CONSTANTS) {
		const existing = await db.select().from(Catalog)
			.where(and(eq(Catalog.type, entry.type), eq(Catalog.key, entry.key)));

		if (existing.length === 0) {
			await db.insert(Catalog).values({
				type: entry.type,
				key: entry.key,
				value: entry.value,
				...sharedColumns,
			});
		} else {
			await db.update(Catalog)
				.set({
					value: entry.value,
					updatedAt: NOW,
					updatedBy: 1,
				})
				.where(and(eq(Catalog.type, entry.type), eq(Catalog.key, entry.key)));
		}
	}

	// Insert Assignments
	await db.insert(Assignment).values([
		{ type: ASSIGNMENT_TYPES.TASK.value, objectType: OBJECT_TYPES.USER.key, recordId: 1, childObjectType: OBJECT_TYPES.PERSON.key, childRecordId: 2, startDate: null, endDate: null, isPrimary: true, ...sharedColumns },
		{ type: ASSIGNMENT_TYPES.TASK.value, objectType: OBJECT_TYPES.PERSON.key, recordId: 2, childObjectType: OBJECT_TYPES.ASSIGNMENT.key, childRecordId: 3, startDate: null, endDate: null, isPrimary: false, ...sharedColumns },
		// Add 8 more rows...
	]);

	// Insert Permissions
	await db.insert(Permision).values([
		{ id: 1, userId: 1, objectType: OBJECT_TYPES.USER.key, recordId: 1, recordStatus: STATUSES.ACTIVE.value, canCreate: true, canRead: true, canUpdate: true, canDelete: false, canExecute: true, ...sharedColumns },
		{ id: 2, userId: 2, objectType: OBJECT_TYPES.PERSON.key, recordId: 2, recordStatus: STATUSES.INACTIVE.value, canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExecute: false, ...sharedColumns },
		// Add 8 more rows...
	]);

	// Insert Files
	await db.insert(File).values([
		{ id: 1, name: "File1", description: true, fileType: FILE_TYPES.DOCUMENT.value, mimeType: "text/plain", ...sharedColumns },
		{ id: 2, name: "File2", description: false, fileType: FILE_TYPES.IMAGE.value, mimeType: "image/jpeg", ...sharedColumns },
		// Add 8 more rows...
	]);

	// Insert FileContents
	await db.insert(FileContent).values([
		{ id: 1, FileId: 1, description: true, filePath: "/tmp/files/file1.txt", storageLocation: STORAGE_LOCATIONS.LOCAL.value, storageProvider: "provider1", checksum: "abc123", isPrimary: true, ...sharedColumns },
		{ id: 2, FileId: 2, description: false, filePath: "/tmp/files/file2.jpg", storageLocation: STORAGE_LOCATIONS.CLOUD.value, storageProvider: "provider2", checksum: "def456", isPrimary: false, ...sharedColumns },
		// Add 8 more rows...
	]);

	// Insert Permission Definitions
	await db.insert(PermissionDef).values([
		{ id: 1, objectType: "USERS", resourceType: PERMISSION_RESOURCE_TYPES.ACTION, resourceName: "getusers", description: "Get list of users", isActive: true, ...sharedColumns },
		{ id: 2, objectType: "USERS", resourceType: PERMISSION_RESOURCE_TYPES.ACTION, resourceName: "createuser", description: "Create a new user", isActive: true, ...sharedColumns },
		{ id: 3, objectType: "USERS", resourceType: PERMISSION_RESOURCE_TYPES.ACTION, resourceName: "updateuser", description: "Update an existing user", isActive: true, ...sharedColumns },
		{ id: 4, objectType: "USERS", resourceType: PERMISSION_RESOURCE_TYPES.ACTION, resourceName: "deleteuser", description: "Delete a user", isActive: true, ...sharedColumns },
		{ id: 5, objectType: "USERS", resourceType: PERMISSION_RESOURCE_TYPES.SCREEN, resourceName: "view", description: "View users screen", isActive: true, ...sharedColumns },
		{ id: 6, objectType: "REPORTS", resourceType: PERMISSION_RESOURCE_TYPES.ACTION, resourceName: "generatereport", description: "Generate reports", isActive: true, ...sharedColumns },
		{ id: 7, objectType: "REPORTS", resourceType: PERMISSION_RESOURCE_TYPES.SCREEN, resourceName: "view", description: "View reports screen", isActive: true, ...sharedColumns },
		{ id: 8, objectType: "SOLICITUDES", resourceType: PERMISSION_RESOURCE_TYPES.ACTION, resourceName: "createsolicitud", description: "Create a solicitud", isActive: true, ...sharedColumns },
		{ id: 9, objectType: "SOLICITUDES", resourceType: PERMISSION_RESOURCE_TYPES.API, resourceName: "getall", description: "Get all solicitudes via API", isActive: true, ...sharedColumns },
		{ id: 10, objectType: "USERS", resourceType: PERMISSION_RESOURCE_TYPES.JOB, resourceName: "cleanup", description: "Run user cleanup job", isActive: true, ...sharedColumns },
	]);

	// Insert Permission Assignments
	await db.insert(PermissionAssigned).values([
		{ id: 1, permissionDefId: 1, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 2, permissionDefId: 2, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 3, permissionDefId: 3, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 4, permissionDefId: 4, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 5, permissionDefId: 5, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 6, permissionDefId: 1, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 2, effect: PERMISSION_EFFECTS.ALLOW, priority: 50, ...sharedColumns },
		{ id: 7, permissionDefId: 5, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 2, effect: PERMISSION_EFFECTS.ALLOW, priority: 50, ...sharedColumns },
		{ id: 8, permissionDefId: 4, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 2, effect: PERMISSION_EFFECTS.DENY, priority: 200, ...sharedColumns },
		{ id: 9, permissionDefId: 6, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: null, effect: PERMISSION_EFFECTS.ALLOW, priority: 75, ...sharedColumns },
		{ id: 10, permissionDefId: 7, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: null, effect: PERMISSION_EFFECTS.ALLOW, priority: 75, ...sharedColumns },
	]);
}