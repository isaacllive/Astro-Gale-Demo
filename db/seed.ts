import { db, User, Person, Catalog, Assignment, Permision, File, FileContent, Notification, PermissionDef, PermissionAssigned, Role, ServiceRequest, NOW, eq, and } from 'astro:db';
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

	// Insert Notifications
	await db.insert(Notification).values([
		{ id: 1, userId: 1, title: "Welcome to the system", message: "Your admin account has been configured successfully.", type: "info", isRead: true, link: "/profile", ...sharedColumns },
		{ id: 2, userId: 1, title: "Service request assigned", message: "You have been assigned to 'Server maintenance request'.", type: "info", isRead: false, link: "/service-requests", ...sharedColumns },
		{ id: 3, userId: 2, title: "Profile updated", message: "Your profile was successfully updated.", type: "success", isRead: true, ...sharedColumns },
		{ id: 4, userId: 2, title: "Password reset required", message: "Please reset your password for security.", type: "warning", isRead: false, link: "/profile", ...sharedColumns },
		{ id: 5, userId: 3, title: "New role assigned", message: "You have been assigned the Manager role.", type: "info", isRead: false, link: "/roles", ...sharedColumns },
		{ id: 6, userId: 4, title: "Database backup complete", message: "Last night's backup completed successfully.", type: "success", isRead: true, ...sharedColumns },
		{ id: 7, userId: 1, title: "Urgent action required", message: "Database backup failure needs immediate attention.", type: "error", isRead: false, link: "/service-requests", ...sharedColumns },
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

	// Insert Assignments (User-Person and User-Role)
	await db.insert(Assignment).values([
		{ id: 1, type: ASSIGNMENT_TYPES.TASK.value, objectType: OBJECT_TYPES.USER.key, recordId: 1, childObjectType: OBJECT_TYPES.PERSON.key, childRecordId: 2, startDate: null, endDate: null, isPrimary: true, ...sharedColumns },
		{ id: 2, type: ASSIGNMENT_TYPES.TASK.value, objectType: OBJECT_TYPES.PERSON.key, recordId: 2, childObjectType: OBJECT_TYPES.ASSIGNMENT.key, childRecordId: 3, startDate: null, endDate: null, isPrimary: false, ...sharedColumns },
		// User-Role assignments
		{ id: 3, type: ASSIGNMENT_TYPES.ROLE.value, objectType: OBJECT_TYPES.USER.key, recordId: 1, childObjectType: OBJECT_TYPES.ROLE.key, childRecordId: 1, startDate: null, endDate: null, isPrimary: true, ...sharedColumns },
		{ id: 4, type: ASSIGNMENT_TYPES.ROLE.value, objectType: OBJECT_TYPES.USER.key, recordId: 2, childObjectType: OBJECT_TYPES.ROLE.key, childRecordId: 2, startDate: null, endDate: null, isPrimary: true, ...sharedColumns },
		{ id: 5, type: ASSIGNMENT_TYPES.ROLE.value, objectType: OBJECT_TYPES.USER.key, recordId: 3, childObjectType: OBJECT_TYPES.ROLE.key, childRecordId: 2, startDate: null, endDate: null, isPrimary: true, ...sharedColumns },
		{ id: 6, type: ASSIGNMENT_TYPES.ROLE.value, objectType: OBJECT_TYPES.USER.key, recordId: 4, childObjectType: OBJECT_TYPES.ROLE.key, childRecordId: 3, startDate: null, endDate: null, isPrimary: true, ...sharedColumns },
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

	// Insert Roles
	await db.insert(Role).values([
		{ id: 1, name: 'Admin', description: 'Full system administration access', ...sharedColumns },
		{ id: 2, name: 'Manager', description: 'Manager with elevated permissions', ...sharedColumns },
		{ id: 3, name: 'Viewer', description: 'Read-only access to system resources', ...sharedColumns },
	]);

	// Insert Service Requests
	await db.insert(ServiceRequest).values([
		{ id: 1, title: "Server maintenance request", description: "Need to schedule routine server maintenance", type: "maintenance", priority: "medium", requesterId: 1, assignedToId: 1, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), ...sharedColumns, status: "pending" },
		{ id: 2, title: "Password reset for new employee", description: "Alice needs her account password reset", type: "support", priority: "high", requesterId: 2, assignedToId: 1, ...sharedColumns, status: "pending" },
		{ id: 3, title: "General inquiry about system access", description: "Question about role permissions", type: "inquiry", priority: "low", requesterId: 3, ...sharedColumns, status: "pending" },
		{ id: 4, title: "Urgent: Database backup failure", description: "Last night's backup failed - needs immediate attention", type: "support", priority: "urgent", requesterId: 1, assignedToId: 1, ...sharedColumns, status: "in_progress" },
	]);

	// Insert Permission Assignments (user-level and role-level)
	await db.insert(PermissionAssigned).values([
		{ id: 1, permissionDefId: 1, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 2, permissionDefId: 2, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 3, permissionDefId: 3, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 4, permissionDefId: 4, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 5, permissionDefId: 5, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 6, permissionDefId: 1, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 2, effect: PERMISSION_EFFECTS.ALLOW, priority: 50, ...sharedColumns },
		{ id: 7, permissionDefId: 5, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 2, effect: PERMISSION_EFFECTS.ALLOW, priority: 50, ...sharedColumns },
		{ id: 8, permissionDefId: 4, subjectType: PERMISSION_SUBJECT_TYPES.USER, subjectId: 2, effect: PERMISSION_EFFECTS.DENY, priority: 200, ...sharedColumns },
		{ id: 9, permissionDefId: 6, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 2, effect: PERMISSION_EFFECTS.ALLOW, priority: 75, ...sharedColumns },
		{ id: 10, permissionDefId: 7, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 2, effect: PERMISSION_EFFECTS.ALLOW, priority: 75, ...sharedColumns },
		// Admin role (id 1): full permissions
		{ id: 11, permissionDefId: 1, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 12, permissionDefId: 2, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 13, permissionDefId: 3, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 14, permissionDefId: 4, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 15, permissionDefId: 5, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 16, permissionDefId: 6, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 17, permissionDefId: 7, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 18, permissionDefId: 8, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 19, permissionDefId: 9, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		{ id: 20, permissionDefId: 10, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 1, effect: PERMISSION_EFFECTS.ALLOW, priority: 100, ...sharedColumns },
		// Viewer role (id 3): read-only
		{ id: 21, permissionDefId: 1, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 3, effect: PERMISSION_EFFECTS.ALLOW, priority: 50, ...sharedColumns },
		{ id: 22, permissionDefId: 5, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 3, effect: PERMISSION_EFFECTS.ALLOW, priority: 50, ...sharedColumns },
		{ id: 23, permissionDefId: 6, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 3, effect: PERMISSION_EFFECTS.ALLOW, priority: 50, ...sharedColumns },
		{ id: 24, permissionDefId: 7, subjectType: PERMISSION_SUBJECT_TYPES.ROLE, subjectId: 3, effect: PERMISSION_EFFECTS.ALLOW, priority: 50, ...sharedColumns },
	]);
}