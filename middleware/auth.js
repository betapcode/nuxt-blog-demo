export default function (context) {
    console.log("[Middleware] The Auth Middleware is running ")
    if (!context.store.getters.isAuthenticated) {
        context.redirect('/admin/auth');
    }
}