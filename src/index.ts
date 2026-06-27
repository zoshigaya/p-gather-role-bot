import { connect } from "./stream.js";
import { assignRole, hasRole, unassignRole } from "./misskey.js";
import { config } from "./config.js";

console.log("Bot start");

connect(async (note) => {
    // 自分自身は無視
    if (note.userId === config.botUserId) {
        return;
    }

    const text = (note.text ?? "")
        .replace(/^@\S+\s*/, "")
        .trim();

    if (text.startsWith(config.joinText)) {
        if (await hasRole(note.userId)) {
            console.log("already joined");
            return;
        }

        await assignRole(note.userId);
        console.log(`${note.user.username} joined`);
        return;
    }

    if (text.includes(config.leaveText)) {
        if (!(await hasRole(note.userId))) {
            console.log("already left");
            return;
        }

        await unassignRole(note.userId);
        console.log(`${note.user.username} left`);
    }
});