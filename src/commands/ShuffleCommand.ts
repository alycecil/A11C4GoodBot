import {isMusicQueueExists, isSameVoiceChannel, isUserInTheVoiceChannel} from "../utils/decorators/MusicHelper";
import {DefineCommand} from "../utils/decorators/DefineCommand";
import {BaseCommand} from "../structures/BaseCommand";
import {createEmbed} from "../utils/createEmbed";
import {Message} from "discord.js";

@DefineCommand({
    aliases: ["rand", "shuffel", "random", "suffle", "stirthatbitch", "mixthesongs"],
    description: "Skip the current music",
    name: "shuffle",
    usage: "{prefix}skip"
})
export class ShuffleCommand extends BaseCommand {
    private shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    @isUserInTheVoiceChannel()
    @isMusicQueueExists()
    @isSameVoiceChannel()
    public execute(message: Message): any {
        message.guild!.queue!.playing = true;
        message.guild?.queue?.connection?.dispatcher.once("speaking", () => message.guild?.queue?.connection?.dispatcher.end());
        message.guild!.queue?.connection?.dispatcher.resume();

        this.shuffle(message.guild?.queue?.songs);

        message.channel.send(
            createEmbed("info", `⏭ **|** Skipped **[${song!.title}](${song!.url}})**`)
                .setThumbnail(song?.thumbnail as string)
        ).catch(e => this.client.logger.error("SKIP_CMD_ERR:", e));
    }

}
