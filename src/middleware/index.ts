import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((_context, next) => {


    // protect api routes
    /*     if (context.url.pathname.startsWith("/api")) {
            if (!isLoggedIn(context)) {
                return context.rewrite(new Request("/login", {
                    headers: {
                        "x-redirect-to": context.url.pathname
                    }
                }));
            }
        } */
    next();
});
