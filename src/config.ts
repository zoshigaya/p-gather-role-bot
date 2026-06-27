import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not set.`);
    }

    return value;
}

export const config = {
    url: requireEnv("MISSKEY_URL"),
    token: requireEnv("MISSKEY_TOKEN"),
    roleId: requireEnv("ROLE_ID"),
    botUserId: process.env.BOT_USER_ID ?? "",
    joinText: "Pギャザにサークル参加します",
    leaveText: "参加キャンセル",
};