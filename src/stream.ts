import WebSocket from "ws";
import { config } from "./config.js";

export function connect(onNote: (note: any) => Promise<void>) {
    const ws = new WebSocket(`${config.url.replace("https", "wss")}/streaming?i=${config.token}`);

    ws.on("open", () => {
        console.log("Connected");

        ws.send(JSON.stringify({
            type: "connect",
            body: {
                id: "main",
                channel: "main"
            }
        }));
    });

    ws.on("message", async (raw) => {
        try {
            const message = JSON.parse(raw.toString());

            if (message.type !== "channel")
                return;

            if (message.body.type !== "mention")
                return;

            const note = message.body.body;

            await onNote(note);

        } catch (e) {
            console.error(e);
        }
    });

    ws.on("close", () => {
        console.log("Disconnected. reconnect after 5 sec...");

        setTimeout(() => {
            connect(onNote);
        }, 5000);
    });

    ws.on("error", console.error);
}