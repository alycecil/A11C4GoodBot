import { ShuffleCommand } from "./ShuffleCommand";
import { isUserInTheVoiceChannel, isMusicQueueExists, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";
import { loopMode } from "../structures/ServerQueue";
import { levenshtein } from "edit-distance";

@DefineCommand({
    aliases: ["games"],
    description: "Play the guessing game",
    name: "game",
    usage: "{prefix}game"
})
export class GameCommand extends ShuffleCommand {
    @isUserInTheVoiceChannel()
    @isMusicQueueExists()
    @isSameVoiceChannel()
    public execute(message: Message, args: string[]): any {
        if (message.guild!.queue!.gaming) {
            // TODO if not playing song die fast
            // if typed at least one thing
            if (args[0]) {
                // const id = message.author.id;
                const standardized = args.join(" ").toLocaleLowerCase();
                const goals = message.guild!.queue?.songs!.first()?.title.toLocaleLowerCase();
                if (!goals) {
                    return;
                }

                const insert = function (node: any): number { return 1; };
                const remove = function (node: any): number { return 1; };
                const update = function (stringA: string, stringB: string): number { return stringA === stringB ? 0 : 1; };


                // Compute edit distance, mapping, and alignment.
                const lev = levenshtein(standardized, goals, insert, remove, update);
                // TODO should be debug
                this.client.logger.info("Levenshtein", lev.distance, lev.pairs(), lev.alignment());


                const scoreRequired = goals.length / 6;
                if (lev.distance < scoreRequired) {
                    message.channel.send(
                        createEmbed("info", `**|** You got a Levenshtein score of ${lev.distance}, it was less than the required ${scoreRequired}... you win! **`)
                    ).catch(e => this.client.logger.error("SKIP_CMD_ERR:", e));
                    // TODO next song
                } else {
                    message.channel.send(
                        createEmbed("info", `**|** You got a Levenshtein score of ${lev.distance}, it was MORE than the required ${scoreRequired}... you did not win! **`)
                    ).catch(e => this.client.logger.error("SKIP_CMD_ERR:", e));
                }
            } else {
                message.channel.send(
                    createEmbed("info", `**|** In game mode already, Join in by typing your guess for author or song. **`)
                ).catch(e => this.client.logger.error("SKIP_CMD_ERR:", e));
            }
        } else {
            // TODO ensure there is a queue of at least N
            // start game
            message.guild!.queue!.gaming = true;

            this.shuffle(message);

            message.guild!.queue!.loopMode = loopMode.all;

            message.channel.send(createEmbed("info", ``))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        }
    }
}
