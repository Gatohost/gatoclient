# <img src="https://img.shields.io/badge/-%F0%9F%90%B1%20Gatoclient%20%7C%20Krunker%20%F0%9F%90%B1%20-blue?" width="500"/>
[![Gatohost](https://img.shields.io/badge/-%F0%9F%90%B1gatohost-informational?style=for-the-badge)]() [![Github All Releases](https://img.shields.io/github/downloads/creepycats/gatoclient/total.svg?style=for-the-badge)]() [![Github Release Verison](https://img.shields.io/github/v/release/creepycats/gatoclient?style=for-the-badge)]()
### The Krunker Client that I painstakingly put together (twice)
[![Discord Banner 2](https://discordapp.com/api/guilds/634754871232430115/widget.png?style=banner2)](https://discord.com/invite/ug7rQZT)

Gatoclient is a Krunker client created and managed by creepycats.
(This was all made by just one developer. Keep that in mind)

Gatoclient is owned in part by [Gatohost](https://gatohost.tk) | Krunker.io is owned and licensed by Yendis AG Switzerland (copyright & trademark)

If you would like to support me, consider following me on my Twitch or Youtube:

[![Twitch](https://img.shields.io/badge/-Twitch-ea82ff?logo=twitch&style=for-the-badge)](https://twitch.tv/creepycats) [![Youtube](https://img.shields.io/badge/-Youtube-ff4d4d?logo=youtube&style=for-the-badge)](https://www.youtube.com/c/creepycatsttv)

## Features

- Performance comparable to IDKR and Client++
- Integrated Modules (Custom Sky, Billboards, FFA Matchmaker, etc)
- Discord RPC
- Chat Emotes and Badges
- Custom UI and CSS + Loading screen
- CSS Swapper (Documents > GatoclientResourceSwapper > CSS)
- Resource Swapper (Documents > GatoclientResourceSwapper > Mod)

###  Custom Loading Screen
![Loading Screen](https://cdn.discordapp.com/attachments/661004708852269080/899423342501703771/unknown.png)

### Custom Settings and UI
![UI Example](https://media.discordapp.net/attachments/634754871894999051/899407146066804746/unknown.png?width=861&height=468)

## Installation
- Go to the releases page
- Download the appropriate portable or setup exe for your PC

_For the Setup Exe (RECOMMENDED)_
- Download the setup exe
- Run The installer
- Install Gatoclient using the installer
- Run the exe on your desktop or your quick start menu

_For the Portable Exe_
- Download and run, the game is already installed in the exe

## Building Source
### THIS IS OUTDATED SOURCE CODE. CONSIDER USING PREPACKAGED SETUP
Gatoclient is built using the same technique as IDKR uses, even though Gatoclient is a totally separate client

You first need to install the source code.

In the GatoclientElectron folder, open Command prompt / Powershell and run the command
```sh
npm install
```
This will install the dependencies. From there, if you want to just run Gatoclient from source, run
```sh
npm start
```
Or if you want to build it, you run
```sh
npm run dist
```
