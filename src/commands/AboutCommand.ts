import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { HappyFace, SadFace } from "../utils/Emojis";
import { Message, version } from "discord.js";
import { uptime as osUptime } from "os";

@DefineCommand({
    aliases: ["botinfo", "info", "information", "stats"],
    name: "about",
    description: "Show the bot's information",
    usage: "{prefix}about"
})
export class AboutCommand extends BaseCommand {
    public async execute(message: Message): Promise<void> {
        if (this.client.config.owners.includes(message.author.id)) {
            const happyFace = HappyFace(this.client);
            const opusEncoder = await this.client.util.getOpusEncoder();
            message.channel.send(
                createEmbed("info", `
\`\`\`asciidoc
Cached users count  :: ${happyFace} ${await this.client.util.getUsersCount()} ${happyFace}
Channels count      :: ${happyFace} ${await this.client.util.getChannelsCount()} ${happyFace}
Guilds count        :: ${happyFace} ${await this.client.util.getGuildsCount()} ${happyFace}
Shards count        :: ${happyFace} ${this.client.shard ? `${this.client.shard.count}` : "N/A"} ${happyFace}
Shard ID            :: ${happyFace} ${this.client.shard ? `${this.client.shard.ids[0]}` : "N/A"} ${happyFace}
Playing Music on    :: ${happyFace} ${await this.client.util.getTotalPlaying()} ${happyFace} guilds
Data Strategy       :: ${happyFace} ${await this.client.config.YouTubeDataRetrievingStrategy === "api" ? "REST API" : "HTML SCRAPING"} ${happyFace}

Platform - Arch     :: ${happyFace} ${process.platform} - ${process.arch} ${happyFace}
OS Uptime           :: ${happyFace} ${this.client.util.formatMS(osUptime() * 1000)} ${happyFace}
Memory (RSS)        :: ${happyFace} ${this.client.util.bytesToSize(process.memoryUsage().rss)} ${happyFace} 
Memory (Heap Total) :: ${happyFace} ${this.client.util.bytesToSize(process.memoryUsage().heapTotal)} ${happyFace}
Memory (Heap Used)  :: ${happyFace} ${this.client.util.bytesToSize(process.memoryUsage().heapUsed)} ${happyFace}
Process Uptime      :: ${happyFace} ${this.client.util.formatMS(process.uptime() * 1000)} ${happyFace}
Bot Uptime          :: ${happyFace} ${this.client.util.formatMS(this.client.uptime!)} ${happyFace}

Node.js version     :: ${happyFace} ${process.version} ${happyFace}
Discord.js version  :: ${happyFace} v${version} ${happyFace}
FFmpeg version      :: ${happyFace} v${(await this.client.util.getPackageJSON("ffmpeg-static"))["ffmpeg-static"]["binary-release-name"]} ${happyFace}
YTDL-Core version   :: ${happyFace} v${(await this.client.util.getPackageJSON("ytdl-core")).version} ${happyFace}
Opus Encoder        :: ${happyFace} ${opusEncoder.pkgMetadata.name} ${happyFace} v${opusEncoder.pkgMetadata.version} ${happyFace} ${happyFace}
Bot version         :: ${happyFace} v${(await this.client.util.getPackageJSON()).version} ${happyFace}

Source code         :: https://github.com/alycecil/A11C4GoodBot
\`\`\`
        `).setAuthor(`${this.client.user?.username as string} - Bot Information`)
            ).catch(e => this.client.logger.error("ABOUT_CMD_ERR:", e));
        } else {
            const sadFace = SadFace(this.client);
            message.channel.send(createEmbed("info", `${sadFace} no ${sadFace} nah ${sadFace} not ${sadFace} you ${sadFace}`))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        }
    }
}
