import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    private readonly envConfig: Record<string, string>;

    constructor() {
        this.envConfig = dotenv.parse(fs.readFileSync(path.join(process.cwd(), `.env.${process.env.NODE_ENV}`)));
    }

    public get(key: string): string {
        return this.envConfig[key];
    }
}