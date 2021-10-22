import { isUserInTheVoiceChannel, isMusicQueueExists, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";

@DefineCommand({
    aliases: ["invert", "flip"],
    description: "Flip the order of music",
    name: "reverse",
    usage: "{prefix}reverse"
})
export class ReverseCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicQueueExists()
    @isSameVoiceChannel()
    public execute(message: Message, args: string[]): any {
        message.react("◀").then(() => {
            message.react("🔁").then(() => {
                this.reverse(message);
                message.channel.send(
                    createEmbed("info", `**|** ◀🔁 Reversed the Queue. ◀🔁 **`)
                ).catch(e => this.client.logger.error("REVERSE_CMD_ERR:", e));
            }).catch(e => this.client.logger.error("REVERSE_CMD_ERR:", e));
        }).catch(e => this.client.logger.error("REVERSE_CMD_ERR:", e));
    }

    public reverse(message: Message): void {
        message.guild!.queue!.playing = true;
        message.guild?.queue?.connection?.dispatcher.once("speaking", () => message.guild?.queue?.connection?.dispatcher.end());
        message.guild?.queue?.songs.reverse();
        message.guild!.queue?.connection?.dispatcher.resume();
    }
}
