/**
 * Catalog Constants
 * 
 * This file contains all catalog values that should be treated as constants
 * in the application. These values are always seeded into the database
 * during the seeding process.
 */

export interface CatalogEntry {
	code: number;
	key: string;
	value: string;
	category?: string;
}

/**
 * Catalog constants organized by category
 */
export const CATALOG_CONSTANTS: Record<string, CatalogEntry[]> = {
	// Status values
	STATUS: [
		{ code: 1001, key: 'STATUS_ACTIVE', value: 'Active', category: 'STATUS' },
		{ code: 1002, key: 'STATUS_INACTIVE', value: 'Inactive', category: 'STATUS' },
		{ code: 1003, key: 'STATUS_PENDING', value: 'Pending', category: 'STATUS' },
		{ code: 1004, key: 'STATUS_DELETED', value: 'Deleted', category: 'STATUS' },
		{ code: 1005, key: 'STATUS_ARCHIVED', value: 'Archived', category: 'STATUS' },
	],

	// Record status values
	RECORD_STATUS: [
		{ code: 2001, key: 'RECORD_STATUS_NEW', value: 'New', category: 'RECORD_STATUS' },
		{ code: 2002, key: 'RECORD_STATUS_ACTIVE', value: 'Active', category: 'RECORD_STATUS' },
		{ code: 2003, key: 'RECORD_STATUS_INACTIVE', value: 'Inactive', category: 'RECORD_STATUS' },
		{ code: 2004, key: 'RECORD_STATUS_COMPLETED', value: 'Completed', category: 'RECORD_STATUS' },
		{ code: 2005, key: 'RECORD_STATUS_CANCELLED', value: 'Cancelled', category: 'RECORD_STATUS' },
	],

	// Gender values
	GENDER: [
		{ code: 3001, key: 'GENDER_MALE', value: 'Male', category: 'GENDER' },
		{ code: 3002, key: 'GENDER_FEMALE', value: 'Female', category: 'GENDER' },
		{ code: 3003, key: 'GENDER_OTHER', value: 'Other', category: 'GENDER' },
		{ code: 3004, key: 'GENDER_PREFER_NOT_TO_SAY', value: 'Prefer not to say', category: 'GENDER' },
	],

	// Assignment types
	ASSIGNMENT_TYPE: [
		{ code: 4001, key: 'ASSIGNMENT_TYPE_TASK', value: 'Task', category: 'ASSIGNMENT_TYPE' },
		{ code: 4002, key: 'ASSIGNMENT_TYPE_PROJECT', value: 'Project', category: 'ASSIGNMENT_TYPE' },
		{ code: 4003, key: 'ASSIGNMENT_TYPE_ROLE', value: 'Role', category: 'ASSIGNMENT_TYPE' },
		{ code: 4004, key: 'ASSIGNMENT_TYPE_RESPONSIBILITY', value: 'Responsibility', category: 'ASSIGNMENT_TYPE' },
	],

	// File types
	FILE_TYPE: [
		{ code: 5001, key: 'FILE_TYPE_DOCUMENT', value: 'Document', category: 'FILE_TYPE' },
		{ code: 5002, key: 'FILE_TYPE_IMAGE', value: 'Image', category: 'FILE_TYPE' },
		{ code: 5003, key: 'FILE_TYPE_VIDEO', value: 'Video', category: 'FILE_TYPE' },
		{ code: 5004, key: 'FILE_TYPE_AUDIO', value: 'Audio', category: 'FILE_TYPE' },
		{ code: 5005, key: 'FILE_TYPE_ARCHIVE', value: 'Archive', category: 'FILE_TYPE' },
		{ code: 5006, key: 'FILE_TYPE_SPREADSHEET', value: 'Spreadsheet', category: 'FILE_TYPE' },
		{ code: 5007, key: 'FILE_TYPE_PRESENTATION', value: 'Presentation', category: 'FILE_TYPE' },
	],

	// Storage locations
	STORAGE_LOCATION: [
		{ code: 6001, key: 'STORAGE_LOCAL', value: 'Local', category: 'STORAGE_LOCATION' },
		{ code: 6002, key: 'STORAGE_CLOUD', value: 'Cloud', category: 'STORAGE_LOCATION' },
		{ code: 6003, key: 'STORAGE_EXTERNAL', value: 'External', category: 'STORAGE_LOCATION' },
	],

	// Object codes (for permissions and assignments)
	OBJECT_CODE: [
		{ code: 7001, key: 'OBJECT_USER', value: 'User', category: 'OBJECT_CODE' },
		{ code: 7002, key: 'OBJECT_PERSON', value: 'Person', category: 'OBJECT_CODE' },
		{ code: 7003, key: 'OBJECT_ASSIGNMENT', value: 'Assignment', category: 'OBJECT_CODE' },
		{ code: 7004, key: 'OBJECT_FILE', value: 'File', category: 'OBJECT_CODE' },
		{ code: 7005, key: 'OBJECT_CATALOG', value: 'Catalog', category: 'OBJECT_CODE' },
	],
};

/**
 * Get all catalog entries as a flat array
 */
export function getAllCatalogEntries(): CatalogEntry[] {
	return Object.values(CATALOG_CONSTANTS).flat();
}

/**
 * Get catalog entries by category
 */
export function getCatalogEntriesByCategory(category: string): CatalogEntry[] {
	return CATALOG_CONSTANTS[category] || [];
}

/**
 * Get catalog entry by key
 */
export function getCatalogEntryByKey(key: string): CatalogEntry | undefined {
	return getAllCatalogEntries().find(entry => entry.key === key);
}

/**
 * Get catalog entry by code
 */
export function getCatalogEntryByCode(code: number): CatalogEntry | undefined {
	return getAllCatalogEntries().find(entry => entry.code === code);
}

/**
 * Convenience exports for commonly used catalog constants
 * These can be imported directly for type safety and easier access
 */
export const STATUS_CODES = {
	ACTIVE: 1001,
	INACTIVE: 1002,
	PENDING: 1003,
	DELETED: 1004,
	ARCHIVED: 1005,
} as const;

export const RECORD_STATUS_CODES = {
	NEW: 2001,
	ACTIVE: 2002,
	INACTIVE: 2003,
	COMPLETED: 2004,
	CANCELLED: 2005,
} as const;

export const GENDER_CODES = {
	MALE: 3001,
	FEMALE: 3002,
	OTHER: 3003,
	PREFER_NOT_TO_SAY: 3004,
} as const;

export const ASSIGNMENT_TYPE_CODES = {
	TASK: 4001,
	PROJECT: 4002,
	ROLE: 4003,
	RESPONSIBILITY: 4004,
} as const;

export const FILE_TYPE_CODES = {
	DOCUMENT: 5001,
	IMAGE: 5002,
	VIDEO: 5003,
	AUDIO: 5004,
	ARCHIVE: 5005,
	SPREADSHEET: 5006,
	PRESENTATION: 5007,
} as const;

export const STORAGE_LOCATION_CODES = {
	LOCAL: 6001,
	CLOUD: 6002,
	EXTERNAL: 6003,
} as const;

export const OBJECT_CODES = {
	USER: 7001,
	PERSON: 7002,
	ASSIGNMENT: 7003,
	FILE: 7004,
	CATALOG: 7005,
} as const;
