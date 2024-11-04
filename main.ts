import 'jsr:@std/dotenv/load';
import { createClient } from 'npm:redis@^4.5';
async function CheckRedisUptime() {
    try {
        const client = createClient({
            url: `redis://${Deno.env.get('REDIS_HOST')}:${Deno.env.get('REDIS_PORT')}`,
            password: Deno.env.get('REDIS_PASSWORD')
        });
        await client.connect();
        const pong = await client.ping();
        await client.quit();
        if (pong === 'PONG') {
            console.log('Redis is running');
        } else {
            throw new Error('Redis is not running');
        }
    } catch (error) {
        console.error('REDIS PING ERROR', error);
        await SendPageM('Redis is not running');
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

Deno.cron('Run once a minute', '* * * * *', CheckRedisUptime);
