module.exports = {
    apps: [
        {
            name: 'Redis Health checker',
            script: './main.ts',
            interpreter: 'deno',
            interpreterArgs: 'run --allow-env --allow-net --allow-read --unstable-cron'
        }
    ]
};
