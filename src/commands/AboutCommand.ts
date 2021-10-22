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
                createEmbed("info", `${happyFace} Hi Mom! ${happyFace}
\`\`\`asciidoc
Cached users count  ::  ${await this.client.util.getUsersCount()} 
Channels count      ::  ${await this.client.util.getChannelsCount()} 
Guilds count        ::  ${await this.client.util.getGuildsCount()} 
Shards count        ::  ${this.client.shard ? `${this.client.shard.count}` : "N/A"} 
Shard ID            ::  ${this.client.shard ? `${this.client.shard.ids[0]}` : "N/A"} 
Playing Music on    ::  ${await this.client.util.getTotalPlaying()}  guilds
Data Strategy       ::  ${await this.client.config.YouTubeDataRetrievingStrategy === "api" ? "REST API" : "HTML SCRAPING"} 

Platform - Arch     ::  ${process.platform} - ${process.arch} 
OS Uptime           ::  ${this.client.util.formatMS(osUptime() * 1000)} 
Memory (RSS)        ::  ${this.client.util.bytesToSize(process.memoryUsage().rss)}  
Memory (Heap Total) ::  ${this.client.util.bytesToSize(process.memoryUsage().heapTotal)} 
Memory (Heap Used)  ::  ${this.client.util.bytesToSize(process.memoryUsage().heapUsed)} 
Process Uptime      ::  ${this.client.util.formatMS(process.uptime() * 1000)} 
Bot Uptime          ::  ${this.client.util.formatMS(this.client.uptime!)} 

Node.js version     ::  ${process.version} 
Discord.js version  ::  v${version} 
FFmpeg version      ::  v${(await this.client.util.getPackageJSON("ffmpeg-static"))["ffmpeg-static"]["binary-release-name"]} 
YTDL-Core version   ::  v${(await this.client.util.getPackageJSON("ytdl-core")).version} 
Opus Encoder        ::  ${opusEncoder.pkgMetadata.name}  v${opusEncoder.pkgMetadata.version}  
Bot version         ::  v${(await this.client.util.getPackageJSON()).version} 

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
