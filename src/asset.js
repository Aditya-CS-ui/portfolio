// Files in /public, resolved against the site's base path.
export const asset = file => import.meta.env.BASE_URL + file;
