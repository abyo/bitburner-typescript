import { NS } from '@ns';

const factions = `
---- Early Games ----

CyberSec: Hacking Level 53 / Install a backdoor on the CSEC server
Tian Di Hui: Hacking Level 50 / $1m / Be in Chongqing, New Tokyo, or Ishima
Netburners: Hacking Level 83 / Hacknet 100/8/4

---- City ----

Sector-12: 15M$ / Be in Sector-12
Chongqing: 20M$ / Be in Chongqing
New Tokyo: 20M$ / Be in New Tokyo
Ishima: 30M$ / Be in Ishima
Aevum: 40M$ / Be in Aevum
Volhaven: 50M$ / Be in Volhaven

---- Hacking Group ----

NiteSec: Hacking Level 212 / Install a backdoor on the avmnite-02h server
The Black Hand: Hacking Level 357 / Install a backdoor on the I.I.I.I server
BitRunners: Hacking Level 531 / Install a backdoor on the run4theh111z server

---- Megacorporations ----

ECorp/MegaCorp/KuaiGong International/Four Sigma/NWO/Blade Industries/OmniTek Incorporated/Bachman & Associates/Clarke Incorporated/Fulcrum Secret Technologies: Have 200k reputation with the Corporation
Fulcrum Secret Technologies: Have 250k reputation with the Corporation / Install a backdoor on the fulcrumassets server

---- Criminal Organizations ----

Slum Snakes: 1M$ / All Combat Stats of 30 / -9 Karma
Tetrads: Be in Chongqing, New Tokyo, or Ishima / All Combat Stats of 75 / -18 Karma
Silhouette: 15M$ / CTO, CFO, or CEO of a company / -22 Karma
Speakers for the Dead: Hacking Level 100 / All Combat Stats of 300 / 30 People Killed / Not working for CIA or NSA / -45 Karma
The Dark Army: Hacking Level 300 / All Combat Stats of 300 / Be in Chongqing / 5 People Killed / Not working for CIA or NSA / -45 Karma
The Syndicate: 10M$ / Hacking Level 200 / All Combat Stats of 200 / Be in Aevum or Sector-12 / Not working for CIA or NSA / -90 Karma

---- Endgame ----

The Covenant: 75B$ / Hacking Level of 850 / All Combat Stats of 850 / 20 Augmentations
Daedalus: 100B$ / Hacking Level of 2500 OR All Combat Stats of 1500 / 30 Augmentations
Illuminati: 150B$ / Hacking Level of 1500 / All Combat Stats of 1200 / 30 Augmentations
`;

export function main(ns : NS) : void {
  ns.tprint(factions);
}
