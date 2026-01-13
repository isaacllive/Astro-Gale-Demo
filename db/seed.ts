import { db, User, Person, Catalog, Assignment, Permision, File, FileContent, NOW, eq } from 'astro:db';
import { getAllCatalogEntries } from '../src/shared/constants';

// https://astro.build/db/seed
export default async function seed() {

	const sharedColumns = {
		status: 'new',
		createdAt: NOW,
		createdBy: 1,
		updatedAt: NOW,
		updatedBy: 1,
		metadata: {}
	};

	// Insert Users
	await db.insert(User).values([
		{ id: 1, username: 'Admin', password: 'default', ...sharedColumns },
		{ id: 2, username: "Isaac", password: 'default', ...sharedColumns },
		{ id: 3, username: "Peter", password: 'default', ...sharedColumns },
		{ id: 4, username: "Kasim", password: 'default', ...sharedColumns },
		{ id: 5, username: "Alice", password: 'default', ...sharedColumns },
		{ id: 6, username: "Bob", password: 'default', ...sharedColumns },
		{ id: 7, username: "Charlie", password: 'default', ...sharedColumns },
		{ id: 8, username: "Diana", password: 'default', ...sharedColumns },
		{ id: 9, username: "Eve", password: 'default', ...sharedColumns },
		{ id: 10, username: "Frank", password: 'default', ...sharedColumns },
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
	// IMPORTANT: Only the constants defined in src/shared/constants.ts are seeded.
	// All catalog values should be defined there, and this function ensures they are
	// always present in the database (inserting if missing, updating if they exist).
	const catalogEntries = getAllCatalogEntries();

	for (const entry of catalogEntries) {
		// Check if catalog entry already exists by code
		const existing = await db.select().from(Catalog).where(eq(Catalog.code, entry.code));

		if (existing.length === 0) {
			// Insert if it doesn't exist
			await db.insert(Catalog).values({
				code: entry.code,
				key: entry.key,
				value: entry.value,
				...sharedColumns,
				metadata: entry.category ? { category: entry.category } : {}
			});
		} else {
			// Update if it exists to ensure values match constants
			await db.update(Catalog)
				.set({
					key: entry.key,
					value: entry.value,
					updatedAt: NOW,
					updatedBy: 1,
					metadata: entry.category ? { category: entry.category } : {}
				})
				.where(eq(Catalog.code, entry.code));
		}
	}

	// Insert Assignments
	await db.insert(Assignment).values([
		{ type: "Task", objectCode: "OBJ1", recordId: 1, childObjectCode: "CHILD1", childRecordId: 2, startDate: null, endDate: null, isPrimary: true, ...sharedColumns },
		{ type: "Task", objectCode: "OBJ2", recordId: 2, childObjectCode: "CHILD2", childRecordId: 3, startDate: null, endDate: null, isPrimary: false, ...sharedColumns },
		// Add 8 more rows...
	]);

	// Insert Permissions
	await db.insert(Permision).values([
		{ id: 1, userId: 1, objectCode: "OBJ1", recordId: 1, recordStatus: "active", canCreate: true, canRead: true, canUpdate: true, canDelete: false, canExecute: true, ...sharedColumns },
		{ id: 2, userId: 2, objectCode: "OBJ2", recordId: 2, recordStatus: "inactive", canCreate: false, canRead: true, canUpdate: false, canDelete: false, canExecute: false, ...sharedColumns },
		// Add 8 more rows...
	]);

	// Insert Files
	await db.insert(File).values([
		{ id: 1, name: "File1", description: true, fileType: "txt", mimeType: "text/plain", ...sharedColumns },
		{ id: 2, name: "File2", description: false, fileType: "jpg", mimeType: "image/jpeg", ...sharedColumns },
		// Add 8 more rows...
	]);

	// Insert FileContents
	await db.insert(FileContent).values([
		{ id: 1, FileId: 1, description: true, filePath: "/tmp/files/file1.txt", storageLocation: "local", storageProvider: "provider1", checksum: "abc123", isPrimary: true, ...sharedColumns },
		{ id: 2, FileId: 2, description: false, filePath: "/tmp/files/file2.jpg", storageLocation: "cloud", storageProvider: "provider2", checksum: "def456", isPrimary: false, ...sharedColumns },
		// Add 8 more rows...
	]);
}