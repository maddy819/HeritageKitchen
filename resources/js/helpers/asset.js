export const asset = (path) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // In production, you might want to use the Vite asset system
    if (import.meta.env.PROD) {
        return `/${cleanPath}`;
    }

    // In development, use the public path
    return `/${cleanPath}`;
};

export default asset;
