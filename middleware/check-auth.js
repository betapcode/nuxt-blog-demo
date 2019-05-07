export default function(context) {
    console.log("[Middleware] The Check-Auth Middleware is running ");
    //if (process.client) {
    context.store.dispatch('initAuth', context.req);
    //}
}