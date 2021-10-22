import { Collection, Snowflake, SnowflakeUtil } from "discord.js";
import { ISong } from "../typings";

export class SongManager extends Collection<Snowflake, ISong> {
    public constructor(data?: ReadonlyArray<readonly [Snowflake, ISong]> | null) {
        super(data);
    }

    public addSong(song: ISong): this {
        return this.set(SnowflakeUtil.generate(), song);
    }

    public deleteFirst(): boolean {
        return this.delete(this.firstKey()!);
    }

    public clear(): this {
        this.forEach((v: ISong, k: Snowflake) => {
            this.delete(k);
        });
        return this;
    }

    public reverse(): this {
        const array = [...this.entries()];
        let currentIndex = array.length;
        let temporaryValue;
        let lowIndex = 0;

        while (currentIndex > lowIndex) {
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[lowIndex];
            array[lowIndex] = temporaryValue;
            lowIndex += 1;
        }

        // Perform clean-up
        this.clear();

        // Set the new entries
        for (const [k, v] of array) {
            this.set(k, v);
        }

        return this;
    }

    public shuffle(): this {
        const array = [...this.entries()];
        let currentIndex = array.length;
        let temporaryValue;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        // Perform clean-up
        this.clear();

        // Set the new entries
        for (const [k, v] of array) {
            this.set(k, v);
        }

        return this;
    }
}
