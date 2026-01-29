/**
 * Catalog Constants
 * All catalog values that should be seeded into the database and in production must be maintaind in sync with this file.
 * type: number representing the category
 * key: unique identifier string
 * value: display value
 */

export const CATALOGS = {
	OBJECT_TYPE: 1,
	STATUS: 2,
	GENDER: 3,
	ASSIGNMENT_TYPE: 4,
	FILE_TYPE: 5,
	STORAGE_LOCATION: 6,
} as const;

// Object Types
export const OBJECT_TYPES = {
	USER: { type: CATALOGS.OBJECT_TYPE, key: 'USER', value: 'User' },
	PERSON: { type: CATALOGS.OBJECT_TYPE, key: 'PERSON', value: 'Person' },
	ASSIGNMENT: { type: CATALOGS.OBJECT_TYPE, key: 'ASSIGNMENT', value: 'Assignment' },
	FILE: { type: CATALOGS.OBJECT_TYPE, key: 'FILE', value: 'File' },
	CATALOG: { type: CATALOGS.OBJECT_TYPE, key: 'CATALOG', value: 'Catalog' },
} as const;

// Status Values
export const STATUSES = {
	ACTIVE: { type: CATALOGS.STATUS, key: 'ACTIVE', value: 'Active' },
	INACTIVE: { type: CATALOGS.STATUS, key: 'INACTIVE', value: 'Inactive' },
	DELETED: { type: CATALOGS.STATUS, key: 'DELETED', value: 'Deleted' },
} as const;

// Gender Values
export const GENDERS = {
	MALE: { type: CATALOGS.GENDER, key: 'MALE', value: 'Male' },
	FEMALE: { type: CATALOGS.GENDER, key: 'FEMALE', value: 'Female' },
	OTHER: { type: CATALOGS.GENDER, key: 'OTHER', value: 'Other' },
	PREFER_NOT_TO_SAY: { type: CATALOGS.GENDER, key: 'PREFER_NOT_TO_SAY', value: 'Prefer not to say' },
} as const;

// Assignment Types
export const ASSIGNMENT_TYPES = {
	TASK: { type: CATALOGS.ASSIGNMENT_TYPE, key: 'TASK', value: 'Task' },
	PROJECT: { type: CATALOGS.ASSIGNMENT_TYPE, key: 'PROJECT', value: 'Project' },
	ROLE: { type: CATALOGS.ASSIGNMENT_TYPE, key: 'ROLE', value: 'Role' },
	RESPONSIBILITY: { type: CATALOGS.ASSIGNMENT_TYPE, key: 'RESPONSIBILITY', value: 'Responsibility' },
} as const;

// File Types
export const FILE_TYPES = {
	DOCUMENT: { type: CATALOGS.FILE_TYPE, key: 'DOCUMENT', value: 'Document' },
	IMAGE: { type: CATALOGS.FILE_TYPE, key: 'IMAGE', value: 'Image' },
	VIDEO: { type: CATALOGS.FILE_TYPE, key: 'VIDEO', value: 'Video' },
	AUDIO: { type: CATALOGS.FILE_TYPE, key: 'AUDIO', value: 'Audio' },
	ARCHIVE: { type: CATALOGS.FILE_TYPE, key: 'ARCHIVE', value: 'Archive' },
	SPREADSHEET: { type: CATALOGS.FILE_TYPE, key: 'SPREADSHEET', value: 'Spreadsheet' },
	PRESENTATION: { type: CATALOGS.FILE_TYPE, key: 'PRESENTATION', value: 'Presentation' },
} as const;

// Storage Locations
export const STORAGE_LOCATIONS = {
	LOCAL: { type: CATALOGS.STORAGE_LOCATION, key: 'LOCAL', value: 'Local' },
	CLOUD: { type: CATALOGS.STORAGE_LOCATION, key: 'CLOUD', value: 'Cloud' },
	EXTERNAL: { type: CATALOGS.STORAGE_LOCATION, key: 'EXTERNAL', value: 'External' },
} as const;

// Permission Subject Types
export const PERMISSION_SUBJECT_TYPES = {
	USER: 'USER',
	ROLE: 'ROLE',
	GROUP: 'GROUP',
	SYSTEM: 'SYSTEM',
} as const;

// Permission Effects
export const PERMISSION_EFFECTS = {
	ALLOW: 'ALLOW',
	DENY: 'DENY',
} as const;

// Permission Resource Types
export const PERMISSION_RESOURCE_TYPES = {
	ACTION: 'ACTION',
	API: 'API',
	SCREEN: 'SCREEN',
	JOB: 'JOB',
} as const;

// Flat array for seeding (auto-generated from grouped constants)
export const CATALOG_CONSTANTS = [
	...Object.values(OBJECT_TYPES),
	...Object.values(STATUSES),
	...Object.values(GENDERS),
	...Object.values(ASSIGNMENT_TYPES),
	...Object.values(FILE_TYPES),
	...Object.values(STORAGE_LOCATIONS),
];

/**
 * Get all constants of a specific type
 */
export function getByType(type: number) {
	return CATALOG_CONSTANTS.filter(c => c.type === type);
}

/**
 * Get a constant by its key
 */
export function getByKey(key: string) {
	return CATALOG_CONSTANTS.find(c => c.key === key);
}

/**
 * Get constants grouped by type
 */
export function getGroupedByType() {
	const grouped: Record<number, typeof CATALOG_CONSTANTS> = {};
	CATALOG_CONSTANTS.forEach(constant => {
		if (!grouped[constant.type]) {
			grouped[constant.type] = [];
		}
		grouped[constant.type].push(constant);
	});
	return grouped;
}
