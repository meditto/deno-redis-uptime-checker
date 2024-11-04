module.exports = {
    apps: [
        {
            name: 'Redis Health checker',
            script: './deno.ts',
            interpreter: 'deno',
            interpreterArgs: 'run --allow-env --allow-net --allow-read --unstable-cron'
        }
    ]
};
