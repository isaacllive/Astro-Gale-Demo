import { defineAction } from 'astro:actions';

export const logout = defineAction({
    handler: async (_, { cookies }) => {
        // Clear the session cookie
        cookies.delete('user-id', {
            path: '/',
        });

        return {
            success: true,
            redirect: '/login'
        };
    }
}); 