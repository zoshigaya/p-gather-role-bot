import { config } from "./config.js";

async function api<T>(endpoint: string, body: object): Promise<T | undefined> {
    const response = await fetch(`${config.url}/api/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"

        },
        body: JSON.stringify({
            i: config.token,
            ...body
        })
    });
    const text = await response.text();

    if (!response.ok) {
        throw new Error(`${endpoint}: ${response.status}\n${text}`);
    } // レスポンスボディが空ならそのまま終了 
    if (!text) {
        return undefined;
    } return JSON.parse(text);
}

export async function getUser(userId: string) {
    return api<any>("users/show", {
        userId
    });
}

export async function assignRole(userId: string) {
    return api("admin/roles/assign", {
        userId,
        roleId: config.roleId
    });
}

export async function unassignRole(userId: string) {
    return api("admin/roles/unassign", {
        userId,
        roleId: config.roleId
    });
}

export async function hasRole(userId: string): Promise<boolean> {
    const user = await getUser(userId);

    return (
        user.roles?.some((role: any) => role.id === config.roleId) ??
        false
    );
}