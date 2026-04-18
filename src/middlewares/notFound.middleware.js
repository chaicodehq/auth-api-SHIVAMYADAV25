/**
 * TODO: Handle 404 errors
 *
 * Return 404 with { error: { message: "Route not found" } }
 */
export function notFound(req, res,next) {
    const err = new Error({error: { message: "Route not found" }})
    err.status = 404
    next(err);
}
