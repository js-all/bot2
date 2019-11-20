///<reference path="./ts/types.d.ts" />
import Discord from 'discord.js';
import fs from 'fs';
import dbm from './ts/dbm';
import * as commands from './ts/index'
import utils from './ts/utils';

const client = new Discord.Client();


async function Initialization() {
    let conf: Conf;
    let accs: AccountObject;
    await dbm.init();
    accs = await dbm.getAccounts();
    if (fs.existsSync('./conf.json')) {
        const parsedJson: Conf = JSON.parse(fs.readFileSync('./conf.json').toString());
        if (parsedJson.token === "YOUR TOKEN HERE") {
            console.log("edit the conf.json file with the token");
            process.exit();
        } else {
            conf = parsedJson;
            client.login(conf.token);
        }
    } else {
        fs.appendFileSync('./conf.json', '{\n   "prefix": "..",\n    "token": "YOUR TOKEN HERE"\n}');
        console.log('no conf.json file were detected, a file has been created edit the token value to make it works');
        process.exit(0);
    }
    console.log('init finalized')
    //@ts-ignore
    return { conf: conf, accs, accs }
}

function AfterInitialization({ conf, accs }: { conf: Conf, accs: AccountObject }) {
    client.on('ready', () => {
        console.log('bot working !');
    });

    client.on('message', msg => {
        const addXp = (msg: Discord.Message) => {
            let acc = utils.getAcc(msg, accs);
            if (acc === undefined && msg.author.bot === false) {

                accs[`<${msg.author.id}>`] = {
                    config: {},
                    coins: 0,
                    messages: 0,
                }
                acc = utils.getAcc(msg, accs);;
            } else if (acc === undefined && msg.author.bot) {
                return;
            }
            const lvlb = utils.calcLvlFromMsg(acc.messages).lvl;
            acc.messages += 1;
            const lvla = utils.calcLvlFromMsg(acc.messages).lvl;
            if (lvlb !== lvla) {
                if(!msg.author.bot)msg.channel.send(`congratulation, <@${msg.author.id}>, you've passed lvl ${lvla} and won ${lvla * lvla * 100} coins !`)
                acc.coins += lvla * lvla * 100;
            }

        }
        if (msg.content.startsWith(conf.prefix)) {
            const noPrefixSplitedcommand = () => {
                let res = "";
                let t = msg.content.split(' ');
                let com1 = t.splice(0, 1).join('');
                let com = com1.slice(conf.prefix.length, com1.length);
                let args = t;
                return {com, t};
            }
            const {t:args} = noPrefixSplitedcommand();
            const {com:msgCom} = noPrefixSplitedcommand();
            let passed = false;
            for (let com in commands) {
                if (msgCom === com) {
                    passed = true;
                    addXp(msg);
                    //@ts-ignore
                    commands[com](accs, msg, client, args, conf).then(e => dbm.setAccounts(e));
                    //commands[com](accs, msg, client, args, conf).then(dbm.setAccounts); not working
                }
            }
            if (!passed) {
                addXp(msg);
                dbm.setAccounts(accs);
            }
        } else {
            addXp(msg);
            dbm.setAccounts(accs);
        }
    })
}

Initialization().then(AfterInitialization);