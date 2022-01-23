// Author: krTree
// Discord: nz#4471
// adapted for use in JANREX by Giant#7650
// RE adapted but for gatoclient
const { ipcRenderer } = require('electron');
const fs = require('fs');
require('v8-compile-cache');

module.exports = () => {
    ipcRenderer.send('logMainConsole', 'Script Started: AutoMatchmaker');
    ipcRenderer.send('ffaNeedSettings');

    ipcRenderer.on('ffaSettings', (event, preferences) => {

        window.addEventListener('keyup', e => {
            if (e.key === 'F4') {
                window.location.href = `https://${window.location.hostname}`;
            }
        })

        var _fetch = window.fetch;
        window.fetch = async (...args) => {
            var search = /matchmaker\.krunker\.io\/seek-game(\?.*)/.exec(args[0]);
            if (!search)
                return _fetch.apply(null, args);

            var query = new URLSearchParams(search[1]);

            var version = query.get('dataQuery'), region = query.get('region'),
                hasGame = query.has('game');

            if (!region || hasGame)
                return _fetch.apply(null, args);

            const gameModes = { ffa: 0, tdm: 1, point: 2, ctf: 3, kc: 19 };

            let filePath = preferences;
            let userPrefs = JSON.parse(fs.readFileSync(filePath));

            var resGL = await fetch(`https://matchmaker.krunker.io/game-list?hostname=${
                window.location.hostname}`)
                .then(_ => _.json());
            var gameList = resGL.games.filter(
                game =>
                    game[4].c === 0 &&                     // Custom Filter
                    game[4].v === JSON.parse(version).v && // Version check
                    game[4].g === Number(userPrefs['matchmakerGamemode']) && // Gamemode check
                    game[2] < game[3] && // Full game check, attemptJoinFull bypasses this
                    game[2] >= Number(userPrefs['matchmakerMinPlayer'])
            )

            var regionFilteredGames =
                gameList.filter(game => game[1] === region); // Filter by region
            if (regionFilteredGames.length !== 0) {
                gameList = regionFilteredGames; // Update game list if available games in
                // correct region and version
            } else {
                alert(
                    'Auto-Join: Switching region, no games of correct gamemode and version found.')
            }

            if (!gameList.length) {
                alert('Auto-Join: No valid games found. Try again soon');
                return _fetch.apply(null, args);
            }

            var shuffledList =
                []; // Shuffle game list to prevent consistantly joining the same game
            while (gameList.length)
                shuffledList.push(
                    ...gameList.splice(Math.floor(Math.random() * gameList.length), 1));
            shuffledList =
                shuffledList.sort((a, b) => b[2] - a[2]); // Sort by player count

            return new Promise(resolve => {
                var index = 0, timeout = Date.now() + 20000;
                async function checkGame() {
                    var gameId = shuffledList[index % shuffledList.length][0];
                    var resGI =
                        await fetch(
                            `https://matchmaker.krunker.io/game-info?game=${gameId}`)
                            .then(_ => _.json()); // Get game data

                    var curPlayers = resGI[2];
                    var maxPlayers = resGI[3];

                    if (curPlayers < maxPlayers) {
                        args[0] += `&game=${gameId}`; // Join if not full
                        checkGame = function () { };
                        _fetch.apply(null, args).then(resolve);
                    } else {
                        if (resGI.error || Date.now() > timeout) {
                            alert('Auto-Join: Failed to join');
                            _fetch.apply(null, args).then(resolve);
                            return;
                        }
                        index++
                        checkGame();
                    }
                }

                checkGame();
            })
        }
    })
}