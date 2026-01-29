import { defineAction } from 'astro:actions';
import { db, User, Person, Assignment, eq, and } from 'astro:db';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { STATUSES, OBJECT_TYPES, ASSIGNMENT_TYPES } from '../shared/constants';

export const register = defineAction({
    accept: 'form',
    input: z.object({
        username: z.string()
            .min(3, 'Username must be at least 3 characters')
            .max(30, 'Username must be less than 30 characters')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
        email: z.string()
            .email('Please enter a valid email address')
            .min(5, 'Email must be at least 5 characters')
            .max(100, 'Email must be less than 100 characters'),
        password: z.string()
            .min(8, 'Password must be at least 8 characters')
            .max(100, 'Password must be less than 100 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string(),
        acceptTerms: z.union([z.boolean(), z.string()]).transform(val => val === true || val === 'true').refine(val => val === true, {
            message: 'You must accept the terms and conditions',
        }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }),
    handler: async ({ username, email, password, acceptTerms }, { cookies }) => {
        try {
            // Check if username already exists
            const existingUsers = await db.select().from(User).where(eq(User.username, username));
            if (existingUsers.length > 0) {
                return {
                    success: false,
                    error: 'Username already exists',
                };
            }

            // Check if email already exists in Person table
            const existingPersons = await db.select().from(Person).where(eq(Person.email, email));
            if (existingPersons.length > 0) {
                return {
                    success: false,
                    error: 'Email already registered',
                };
            }

            // Hash password
            const hashedPassword = await hash(password, 10);

            // Create user
            const [user] = await db.insert(User).values({
                username,
                password: hashedPassword,
                status: STATUSES.ACTIVE.value,
                createdBy: 1, // System user
                updatedBy: 1,
            }).returning();

            // Create person record with email
            const [person] = await db.insert(Person).values({
                firstName: username, // Use username as default first name
                lastName: '', // Can be updated later
                email,
                phone: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                dateOfBirth: new Date(),
                gender: '',
                status: STATUSES.ACTIVE.value,
                createdBy: user.id,
                updatedBy: user.id,
            }).returning();

            // Create assignment linking User to Person
            await db.insert(Assignment).values({
                type: ASSIGNMENT_TYPES.ROLE.value,
                objectType: OBJECT_TYPES.USER.key,
                recordId: user.id,
                childObjectType: OBJECT_TYPES.PERSON.key,
                childRecordId: person.id,
                isPrimary: true,
                status: STATUSES.ACTIVE.value,
                createdBy: user.id,
                updatedBy: user.id,
            });

            // Set session cookie
            cookies.set('user-id', user.id.toString(), {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: 'strict',
            });

            return {
                success: true,
                redirect: '/dashboard'
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
            };
        }
    }
}); 