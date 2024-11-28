import 'jsr:@std/dotenv/load';
import { createClient } from 'npm:redis@^4.5';
import InfoParser from 'npm:redis-info';

async function CheckRedisUptime() {
    try {
        const client = createClient({
            url: `redis://${Deno.env.get('REDIS_HOST')}:${Deno.env.get('REDIS_PORT')}`,
            password: Deno.env.get('REDIS_PASSWORD')
        });
        await client.connect();
        const pong = await client.ping();
        if (pong !== 'PONG') {
            await client.quit();
            throw new Error('Redis is not running');
        } else {
            const memory = await client.info('memory');
            const info = InfoParser.parse(memory);
            console.log(
                [
                    Deno.env.get('REDIS_SERVER_NAME'),
                    'is running. time:',
                    new Date().toISOString(),
                    '- memory:',
                    info.used_memory_human
                ].join(' ')
            );
            await client.quit();
        }
    } catch (error: any) {
        console.error('REDIS PING ERROR', error);
        await SendPageM(`${Deno.env.get('REDIS_SERVER_NAME')} is not running, ${error?.message}`);
    }
}

async function SendPageM(message: string) {
    const response = await fetch('https://www.pagem.com/api/v2/page/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            authentication: Deno.env.get('PAGEM_API_KEY')
        },
        body: `id=${Deno.env.get('PAGEM_API_ID')}&message=${message}`
    });
    const data = await response.json();
    console.log(data);
}

Deno.cron('Run once a minute', '*/5 * * * *', CheckRedisUptime);
