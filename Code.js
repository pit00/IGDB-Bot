const Telegraf = require('telegraf');
const app = new Telegraf(process.env.BOT_KEY, {username: process.env.BOT_NAME});
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.BOT_KEY);
const igdb = require('igdb-api-node').default;
const client = igdb(process.env.USER_KEY);
const unirest = require('unirest');
const schedule = require('node-schedule');
const currencyFormatter = require('currency-formatter');
const moment = require('moment');
moment.relativeTimeRounding(Math.floor);
moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24);
moment.relativeTimeThreshold('d', 31);
moment.relativeTimeThreshold('M', 12);

require('dotenv').config();

app.command('start', (ctx) => {
    ctx.reply('Welcome to IGDB Bot.\nLost? Use /help');
});

app.command('help', (ctx) => {
    ctx.replyWithMarkdown('To search: /game [name] or via inline - @IGDBBot [name]\n/news for game news (most recent). Alternately, visit [Pulse - Game News](https://t.me/pulsegamenews)\nTo send a feedback: /feedback [suggestion]', {disable_web_page_preview: false});
});

function genre(gam){
    try{
        var gen = JSON.stringify(gam.genres)
            .replace(/[[\]]/g, '')
            .replace(/,/g, ' | ')
            .replace('33', 'Arcade')
            .replace('32', 'Indie')
            .replace('31', 'Adventure')
            .replace('30', 'Pinball')
            .replace('26', 'Quiz | Trivia')
            .replace('25', 'Hack And Slash | Beat \'Em Up')
            .replace('24', 'Tactical')
            .replace('16', 'TBS')
            .replace('15', 'Strategy')
            .replace('14', 'Sport')
            .replace('13', 'Simulator')
            .replace('12', 'RPG')
            .replace('11', 'RTS')
            .replace('10', 'Racing')
            .replace('9', 'Puzzle')
            .replace('8', 'Platform')
            .replace('7', 'Music')
            .replace('5', 'Shooter')
            .replace('4', 'Fighting')
            .replace('2', 'Point And Click');

        return ('\n<b>Genre</b>: ' + gen);
    }
    catch(error){
        console.log('Genre: ' + error);
        return ('⁣');
    }
}

function perspec(gam){
    try{
        var view = JSON.stringify(gam.player_perspectives)
            .replace(/[[\]]/g, '')
            .replace(/,/g, ' | ')
            .replace('1', 'First Person')
            .replace('2', 'Third Person')
            .replace('3', 'Bird View')
            .replace('4', 'Side View')
            .replace('5', 'Text')
            .replace('6', 'Aural')
            .replace('7', 'Virtual Reality');
            
        return ('\n<b>Perspective</b>: ' + view);
    }
    catch(error){
        console.log('View: ' + error);
        return ('⁣');
    }
}

function theme(gam){
    try{
        var them = JSON.stringify(gam.themes)
            .replace(/[[\]]/g, '')
            .replace(/,/g, ' | ')
            .replace('43', 'Mystery')
            .replace('42', 'Erotic')
            .replace('41', '𝟦X')
            .replace('40', 'Party')
            .replace('39', 'Warfare')
            .replace('38', 'Open World')
            .replace('35', 'Kids')
            .replace('34', 'Educational')
            .replace('33', 'Sandbox')
            .replace('32', 'Non-Fiction')
            .replace('31', 'Drama')
            .replace('28', 'Business')
            .replace('27', 'Comedy')
            .replace('23', 'Stealth')
            .replace('22', 'Historical')
            .replace('21', 'Survival')
            .replace('20', 'Thriller')
            .replace('19', 'Horror')
            .replace('18', 'Sci-Fi')
            .replace('17', 'Fantasy')
            .replace('1', 'Action');

        return ('\n<b>Theme</b>: ' + them);
    }
    catch(error){
        console.log(error);
        return ('⁣');
    }
}

function mode(gam){
    try{
        var mods = JSON.stringify(gam.game_modes)
            .replace(/[[\]]/g, '')
            .replace(/,/g, ' | ')
            .replace('1', 'Single Player')
            .replace('2', 'Multiplayer')
            .replace('3', 'Co-Op')
            .replace('4', 'Split Screen')
            .replace('5', 'MMO');
            
        return ('\n<b>Game Mode</b>: ' + mods);
    }
    catch(error){
        console.log(error);
        return ('⁣');
    }
}

function plat(gam){
    var plaf = [], order, dup;
    try{
        for(var i = 0; i < gam.release_dates.length; i++)
            plaf[i] = JSON.stringify(gam.release_dates[i].platform);
        
        dup = plaf.filter(function(elem, index, self){
            return index == self.indexOf(elem);
        });
        
        for(var j = 0; j < dup.length; j++){
            dup[j] = dup[j]
                .replace('136', 'Neo Geo CD')
                .replace('135', 'Hyper Neo Geo 𝟨𝟦')
                .replace('134', 'Acorn Electron')
                .replace('133', 'Philips Videopac G𝟩𝟢𝟢𝟢')
                .replace('132', 'Amazon Fire TV')
                .replace('131', 'Nintendo PlayStation')
                .replace('130', 'Nintendo Switch')
                .replace('129', 'Texas Instruments TI-𝟫𝟫')
                .replace('128', 'PC Engine SuperGrafx')
                .replace('127', 'Fairchild Channel F')
                .replace('126', 'TRS-𝟪𝟢')
                .replace('125', 'PC-𝟪𝟪𝟢𝟣')
                .replace('124', 'SwanCrystal')
                .replace('123', 'WonderSwan Color')
                .replace('122', 'Nuon')
                .replace('121', 'Sharp X𝟨𝟪𝟢𝟢𝟢')
                .replace('120', 'Neo Geo Pocket Color')
                .replace('119', 'Neo Geo Pocket')
                .replace('118', 'FM Towns')
                .replace('117', 'Philips CD-i')
                .replace('116', 'Acorn Archimedes')
                .replace('115', 'Apple IIGS')
                .replace('114', 'Amiga CD𝟥𝟤')
                .replace('113', 'OnLive Game System')
                .replace('111', 'Imlac PDS-`𝟣𝟣𝟤, `Microcomputer')
                .replace('110', 'PLATO')
                .replace('109', 'CDC Cyber 𝟩𝟢')
                .replace('108', 'PDP-𝟣𝟣')
                .replace('107', 'Call-A-Computer time-shared mainframe computer system')
                .replace('106', 'SDS Sigma 7')
                .replace('105', 'HP 𝟥𝟢𝟢𝟢')
                .replace('104', 'HP 𝟤𝟣𝟢𝟢')
                .replace('103', 'PDP-𝟩')
                .replace('102', 'EDSAC')
                .replace('101', 'Ferranti Nimrod Computer')
                .replace('100', 'Analogue electronics')
                .replace('99', 'Family Computer')
                .replace('98', 'DEC GT𝟦𝟢')
                .replace('97', 'PDP-𝟪')
                .replace('96', 'PDP-𝟣𝟢')
                .replace('95', 'PDP-𝟣')
                .replace('94', 'Commodore Plus/𝟦')
                .replace('93', 'Commodore 𝟣𝟨')
                .replace('92', 'SteamOS')
                .replace('91', 'Bally Astrocade')
                .replace('90', 'Commodore PET')
                .replace('89', 'Microvision')
                .replace('88', 'Odyssey')
                .replace('87', 'Virtual Boy')
                .replace('86', 'TurboGrafx-𝟣𝟨/PC Engine')
                .replace('85', 'Donner Model 𝟥𝟢')
                .replace('84', 'SG-𝟣𝟢𝟢𝟢')
                .replace('82', 'Web browser')
                .replace('80', 'Neo Geo AES')
                .replace('79', 'Neo Geo MVS')
                .replace('78', 'Sega CD')
                .replace('77', 'Sharp X𝟣')
                .replace('75', 'Apple II')
                .replace('74', 'Windows Phone')
                .replace('73', 'BlackBerry OS')
                .replace('72', 'Ouya')
                .replace('71', 'Commodore VIC-𝟤𝟢')
                .replace('70', 'Vectrex')
                .replace('69', 'BBC Microcomputer System')
                .replace('68', 'ColecoVision')
                .replace('67', 'Intellivision')
                .replace('66', 'Atari 𝟧𝟤𝟢𝟢')
                .replace('65', 'Atari 𝟪-bit')
                .replace('64', 'Sega Master System')
                .replace('63', 'Atari ST/STE')
                .replace('62', 'Atari Jaguar')
                .replace('61', 'Atari Lynx')
                .replace('60', 'Atari 𝟩𝟪𝟢𝟢')
                .replace('59', 'Atari 𝟤𝟨𝟢𝟢')
                .replace('58', 'Super Famicom')
                .replace('57', 'WonderSwan')
                .replace('56', 'WiiWare')
                .replace('55', 'Mobile')
                .replace('53', 'MSX𝟤')
                .replace('52', 'Arcade')
                .replace('51', 'Family Computer Disk System')
                .replace('50', '𝟥DO Interactive Multiplayer')
                .replace('49', 'Xbox One')
                .replace('48', 'PlayStation 𝟦')
                .replace('47', 'Virtual Console (Nintendo)')
                .replace('46', 'PlayStation Vita')
                .replace('45', 'PlayStation Network')
                .replace('44', 'Tapwave Zodiac')
                .replace('42', 'N-Gage')
                .replace('41', 'Wii U')
                .replace('39', 'iOS')
                .replace('38', 'PlayStation Portable')
                .replace('37', 'Nintendo 𝟥DS')
                .replace('36', 'Xbox Live Arcade')
                .replace('35', 'Sega Game Gear')
                .replace('34', 'Android')
                .replace('33', 'Game Boy')
                .replace('32', 'Sega Saturn')
                .replace('30', 'Sega 𝟥𝟤X')
                .replace('29', 'Sega Mega Drive/Genesis')
                .replace('27', 'MSX')
                .replace('26', 'ZX Spectrum')
                .replace('25', 'Amstrad CPC')
                .replace('24', 'Game Boy Advance')
                .replace('23', 'Dreamcast')
                .replace('22', 'Game Boy Color')
                .replace('21', 'Nintendo GameCube')
                .replace('20', 'Nintendo DS')
                .replace('19', 'Super Nintendo Entertainment System (SNES)')
                .replace('18', 'Nintendo Entertainment System (NES)')
                .replace('16', 'Amiga')
                .replace('15', 'Commodore C𝟨𝟦/𝟣𝟤𝟪')
                .replace('14', 'Mac')
                .replace('13', 'PC DOS')
                .replace('12', 'Xbox 𝟥𝟨𝟢')
                .replace('11', 'Xbox')
                .replace('9', 'PlayStation 𝟥')
                .replace('7', 'PlayStation')
                .replace('8', 'PlayStation 𝟤')
                .replace('6', 'PC (Microsoft Windows)')
                .replace('5', 'Wii')
                .replace('4', 'Nintendo 𝟨𝟦')
                .replace('3', 'Linux');
        }
        
        order = dup.join(' | ');
        
        return ('\n<b>Platforms</b>: ' + order);
    }
    catch(error){
        console.log(error);
        return ('⁣');
    }
}

function steam(gam){
    var stem;
    try{
        stem = 'http://store.steampowered.com/app/' + gam.external.steam;
        return '\n' + ('Steam Store').link(stem);
    }
    catch (error){
        console.log(error);
        return ('⁣');
    }
}

function urat(gam){
    var rat = parseFloat(gam.rating);
    if(isNaN(rat))
        return ('⁣');
    else{
        rat = rat.toFixed(2);
        rat = Math.round(rat);
        return '\n<b>User Rating</b>: ' + rat + '/100';
    }
}

function crat(gam){
    var crit = parseFloat(gam.aggregated_rating);
    if(isNaN(crit))
        return ('⁣');
    else{
        crit = crit.toFixed(2);
        crit = Math.round(crit);
        return '\n<b>Critic Rating</b>: ' + crit + '/100';
    }
}

app.command('news', ctx => {
    client.pulses({
        fields: '*&limit=3&order=published_at:desc'})
        .then(
            res => {
                var site, Pic, Header, Sum;
        
                site = res.body[0];

                Pic = ('⁣').link(site.image);
                Header = (site.title.replace(/"/g,'')).link(site.url);
                Sum = '\n' + site.summary;
                ctx.replyWithHTML(`${Pic}${Header}${Sum}`);
            },
            rip => {
                console.log('RIP: ' + rip);
                ctx.reply('No news 😦');
            });
});

app.command('game', ctx => {
    const key = ctx.message.text.replace(/[^\s]+ /, '');
    key.replace(/&#39;/, '\'');

    var game, Cover, Header, Available, RatingU, RatingC, Genre, View, Steam, Theme, Modes, Plats, Price;

    client.games({
        search: key,
        limit: 1,
        fields: '*'})
        .then(
            res => {
                if(res.body == '')
                    ctx.reply('Game not found 😦');

                try{
                    for(var i in res.body){
                        game = res.body[i];
                        game.cover = client.image(game.cover, 'cover_big');
                    }

                    Cover = ('⁣').link(game.cover);
                }
                catch(error){
                    console.log('Cover: ' + error);
                    Cover = '⁣';
                }

                //Header (Name [Year] + link)
                try{
                    if (game.release_dates[0].y != undefined)
                        Header = (game.name.replace(/"/g,'') + ' [' + game.release_dates[0].y + ']').link(game.url);
                    else
                        Header = (game.name.replace(/"/g,'')).link(game.url.replace(/"/g,''));
                }
                catch(error){
                    console.log('Year: ' + error);
                    Header = (game.name.replace(/"/g,'')).link(game.url.replace(/"/g,''));
                }

                try{
                    var TBA = new Date(game.release_dates[0].human);
                    Available = `\nAvailable ${moment(TBA).fromNow()}`;
                    if (Available.split(' ')[1] != 'in')
                        Available = '⁣';
                }
                catch(error){
                    console.log('TBA: ' + error);
                    Available = '⁣';
                }
                
                RatingU = urat(game);
                
                RatingC = crat(game);
                
                Genre = genre(game);
                
                View = perspec(game);
                
                Theme = theme(game);
                
                Modes = mode(game);
                
                Plats = plat(game);
                
                Steam = steam(game);

                if (key == '/game')
                    ctx.reply('Game not found 😦');
                else{
                    try{ //get price (command mode only)
                        var url = 'http://store.steampowered.com/api/appdetails?appids=' + game.external.steam + '&cc=br&filters=price_overview';
                        unirest.get(url).end(function (result){
                            var res = result.body;
                            for(var elem in res){
                                if(res.hasOwnProperty(elem)){
                                    var price = (res[elem].data.price_overview.final) / 100;
                                    var off = res[elem].data.price_overview.discount_percent;
                                    var Discount;
                                    if(off != 0)
                                        Discount = ' [-' + off + '%]';
                                    else
                                        Discount = '⁣';

                                    Price = '\n<b>Price</b>: ' + currencyFormatter.format(price, {code: 'BRL'}) + Discount;
                                    ctx.replyWithHTML(`${Cover}${Header}${Available}${Genre}${Theme}${Modes}${Plats}${View}${RatingU}${RatingC}${Steam}${Price}`);
                                }
                            }
                        });
                    }
                    catch(error){
                        console.log(error);
                        ctx.replyWithHTML(`${Cover}${Header}${Available}${Genre}${Theme}${Plats}${View}${RatingU}${RatingC}`);
                    }
                }
            },
            rip => {
                console.log('RIP: ' + rip);
                ctx.reply('Game not found 😦');
            });
});

function inlineReply(json){
    var Cover, Header, Available, RatingU, RatingC, Genre, View, Steam, Theme, Modes, Plats, Price;
    
    var Sum = 'No summary available, please contribute!';
    if (json.summary != undefined)
        Sum = json.summary;

    var Pub;
    try{
        if (json.release_dates[0].y != undefined)
            Pub = ` [${json.release_dates[0].y}]`;
        else
            Pub = '⁣';
    }
    catch(error){
        Pub = '⁣';
    }
    
    var thumb;
    try{
        thumb = client.image(json.cover, 'cover_big');
        Cover = ('⁣').link(thumb);
    }
    catch(error){
        thumb = 'http://i.imgur.com/PytWPMu.png';
        console.log('Cover: ' + error);
        Cover = '⁣';
    }
    
    try{
        if (json.release_dates[0].y != undefined)
            Header = (json.name.replace(/"/g,'') + ' [' + json.release_dates[0].y + ']').link(json.url);
        else
            Header = (json.name.replace(/"/g,'')).link(json.url);
    }
    catch(error){
        Header = (json.name.replace(/"/g,'')).link(json.url);
    }
    
    try{
        var TBA = new Date(json.release_dates[0].human);
        Available = `\nAvailable ${moment(TBA).fromNow()}`;
        if(Available.split(' ')[1] != 'in')
            Available = '⁣';
    }
    catch(error){
        Available = '⁣';
    }

    RatingU = urat(json);
    
    RatingC = crat(json);
    
    Genre = genre(json);
    
    View = perspec(json);
    
    Theme = theme(json);
    
    Modes = mode(json);
    
    Plats = plat(json);
    
    Steam = steam(json);

    return{
        type: 'article',
        id: String(json.id),
        title: `${json.name}${Pub}`,
        description: `${Sum}`,
        thumb_url: thumb,
        input_message_content:{
            message_text: `${Cover}${Header}${Available}${Genre}${Theme}${Modes}${Plats}${View}${RatingU}${RatingC}${Steam}${Price}`,
            parse_mode: 'HTML',
        }
    };
}

function inlineAnswer(list){
    if(String(list) == ''){
        return Promise.all([{
            type: 'article',
            id: '0',
            title: 'No games were found!',
            description: 'Retry. If you wish.',
            thumb_url: 'http://i.imgur.com/qXvND6U.png',
            input_message_content:{
                message_text: '`G A M E   O V E R !`',
                parse_mode: 'Markdown'
            }
        }]);
    }
    else
        return Promise.all(list.map(json => inlineReply(json)))
            .catch(issue => console.log('Promise: ' + issue));
}

function inlineSearch(inline){
    if('' == inline)
        return Promise.all([{
            type: 'article',
            id: '0',
            title: 'Insert Coin!',
            description: 'Type a game name',
            thumb_url: 'http://i.imgur.com/IjsffTB.png',
            input_message_content:{
                message_text: '`G A M E   O V E R !`',
                parse_mode: 'Markdown'
            }
        }]);
    else
        return client.games({search: inline.replace(/&#39;/, '\''), limit: 10, fields: '*'})
            .then(list => inlineAnswer(list.body))
            .catch(issue => {
                console.log('Not find: ' + issue);
                return [{
                    type: 'article',
                    id: '0',
                    title: 'Not Found!',
                    description: 'Retry. If you wish.',
                    thumb_url: 'http://i.imgur.com/qXvND6U.png',
                    input_message_content:{
                        message_text: '`G A M E   O V E R !`',
                        parse_mode: 'Markdown'
                    }
                }];
            });
}

app.on('inline_query', ctx => {
    const inline = ctx.inlineQuery.query || '';
    console.log('INPUT: ' + inline);

    inlineSearch(inline).then(results => ctx.answerInlineQuery(results)).catch(issue => console.log('inlineSearch: ', issue));
});

app.startPolling();