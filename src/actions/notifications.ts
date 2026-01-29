import { db, eq, Notification, and, desc, ne, or } from 'astro:db';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const createNotification = defineAction({
    input: z.object({
        userId: z.number(),
        title: z.string(),
        message: z.string(),
        type: z.enum(['info', 'success', 'warning', 'error']).optional(),
        link: z.string().optional(),
        createdBy: z.number().optional(),
    }),
    handler: async (input) => {
        const now = new Date();
        await db.insert(Notification).values({
            userId: input.userId,
            title: input.title,
            message: input.message,
            type: input.type || 'info',
            link: input.link,
            isRead: false,
            createdAt: now,
            createdBy: input.createdBy || 1,
            updatedAt: now,
            updatedBy: input.createdBy || 1,
            status: 'Active',
        });

        return { success: true, message: "Notification created successfully" };
    }
});

export const getNotifications = defineAction({
    input: z.object({
        userId: z.number(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        unreadOnly: z.boolean().optional().default(false),
    }),
    handler: async (input) => {
        const { userId, page = 1, pageSize = 20, unreadOnly = false } = input;
        const offset = (page - 1) * pageSize;

        // Build where condition - exclude deleted notifications
        const baseCondition = and(
            eq(Notification.userId, userId),
            or(eq(Notification.status, 'Active'), ne(Notification.status, 'deleted'))
        );
        
        const whereCondition = unreadOnly
            ? and(baseCondition, eq(Notification.isRead, false))
            : baseCondition;

        const notifications = await db.select()
            .from(Notification)
            .where(whereCondition)
            .orderBy(desc(Notification.createdAt))
            .limit(pageSize)
            .offset(offset);

        // Get total count
        const allNotifications = await db.select()
            .from(Notification)
            .where(whereCondition);
        
        const total = allNotifications.length;

        return {
            success: true,
            message: "Notifications fetched successfully",
            data: notifications,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            }
        };
    }
});

export const getUnreadCount = defineAction({
    input: z.object({
        userId: z.number(),
    }),
    handler: async (input) => {
        const notifications = await db.select()
            .from(Notification)
            .where(
                and(
                    eq(Notification.userId, input.userId),
                    eq(Notification.isRead, false),
                    or(eq(Notification.status, 'Active'), ne(Notification.status, 'deleted'))
                )
            );

        return {
            success: true,
            count: notifications.length,
        };
    }
});

export const markAsRead = defineAction({
    input: z.object({
        notificationId: z.number(),
        userId: z.number(),
    }),
    handler: async (input) => {
        // Verify the notification belongs to the user
        const notifications = await db.select()
            .from(Notification)
            .where(
                and(
                    eq(Notification.id, input.notificationId),
                    eq(Notification.userId, input.userId)
                )
            );

        if (notifications.length === 0) {
            return { success: false, error: "Notification not found or access denied" };
        }

        await db.update(Notification)
            .set({
                isRead: true,
                updatedAt: new Date(),
                updatedBy: input.userId,
            })
            .where(eq(Notification.id, input.notificationId));

        return { success: true, message: "Notification marked as read" };
    }
});

export const markAllAsRead = defineAction({
    input: z.object({
        userId: z.number(),
    }),
    handler: async (input) => {
        await db.update(Notification)
            .set({
                isRead: true,
                updatedAt: new Date(),
                updatedBy: input.userId,
            })
            .where(
                and(
                    eq(Notification.userId, input.userId),
                    eq(Notification.isRead, false)
                )
            );

        return { success: true, message: "All notifications marked as read" };
    }
});

export const deleteNotification = defineAction({
    input: z.object({
        notificationId: z.number(),
        userId: z.number(),
    }),
    handler: async (input) => {
        // Verify the notification belongs to the user
        const notifications = await db.select()
            .from(Notification)
            .where(
                and(
                    eq(Notification.id, input.notificationId),
                    eq(Notification.userId, input.userId)
                )
            );

        if (notifications.length === 0) {
            return { success: false, error: "Notification not found or access denied" };
        }

        await db.update(Notification)
            .set({
                status: 'deleted',
                updatedAt: new Date(),
                updatedBy: input.userId,
            })
            .where(eq(Notification.id, input.notificationId));

        return { success: true, message: "Notification deleted successfully" };
    }
});
