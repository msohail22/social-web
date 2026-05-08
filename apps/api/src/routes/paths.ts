export const API_BASE_PATH = "/api/v1";

export const authPath = (path = ""): string => `${API_BASE_PATH}/auth${path}`;
