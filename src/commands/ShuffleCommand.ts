import { isUserInTheVoiceChannel, isMusicQueueExists, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";

@DefineCommand({
    aliases: ["rand", "shuffel", "random", "suffle", "stirthatbitch", "mixthesongs"],
    description: "Skip the current music",
    name: "shuffle",
    usage: "{prefix}skip"
})
export class ShuffleCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicQueueExists()
    @isSameVoiceChannel()
    public execute(message: Message, args: string[]): any {
        message.react("🔀").then(() => {
            this.shuffle(message);
            message.channel.send(
                createEmbed("info", `**|** 🔀 Shuffled the Queue. 🔀 **`)
            ).catch(e => this.client.logger.error("SHUFFLE_CMD_ERR:", e));
        }).catch(e => this.client.logger.error("SHUFFLE_CMD_ERR:", e));
    }

    public shuffle(message: Message): void {
        message.guild!.queue!.playing = true;
        message.guild?.queue?.connection?.dispatcher.once("speaking", () => message.guild?.queue?.connection?.dispatcher.end());
        message.guild?.queue?.songs.shuffle();
        message.guild!.queue?.connection?.dispatcher.resume();
    }
}
