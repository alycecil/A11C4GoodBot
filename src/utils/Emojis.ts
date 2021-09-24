import { Client, GuildEmoji } from "discord.js";

function get(client: Client, id: any): GuildEmoji | undefined {
    return client.emojis.cache.get(id);
}

function getWithDefault(client: Client, id: any, defaultText: string): any {
    const emoji = get(client, id);
    return emoji ? emoji : defaultText;
}

export function HappyFace(client: Client): any {
    return getWithDefault(client, "884091311987245086", "😀");
}

export function SadFace(client: Client): any {
    return getWithDefault(client, "884448926520987669", "😕");
}
