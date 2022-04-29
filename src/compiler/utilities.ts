import { NS, Server, Player } from '@ns';
import { ServerInfo } from '/lib/server';

/**
 * It generates a random string of 16 characters.
 * @returns A string of 16 random characters.
 */
export function generateRandomString(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * The function takes the current server and a set of servers. It then scans the current
 * server for connections, filters out connections that are already in the set, then adds all new
 * connections to it
 * @param {NS} ns - Netscript API.
 * @param {string} currentServer - the current server you're on
 * @param set - a set of all servers that have been visited
 * @returns an array of all servers names
 */
export function getServersList(ns: NS, currentServer = 'home', set = new Set<string>()): string[] {
  let serverConnections: string[] = ns.scan(currentServer);
  serverConnections = serverConnections.filter((s) => !set.has(s));
  serverConnections.forEach((server) => {
    set.add(server);
    return getServersList(ns, server, set);
  });

  return Array.from(set.keys());
}

/**
 * Convert server list into an array of ServerInfo objects
 * @param {NS} ns - Netscript API
 * @returns An array of ServerInfo objects.
 */
export function getServersInfos(ns: NS): ServerInfo[] {
  const servers = getServersList(ns);
  const serversData = [];

  for (const server of servers) {
    serversData.push(new ServerInfo(ns, server));
  }

  return serversData;
}

/**
 * It recursively scans the network for the target server
 * and returns the route it took to get there
 * https://github.com/tyrope/bitburner/blob/master/lib/netLib.js#L30-L59
 * @param {NS} ns - The NS object
 * @param {string} source - The server you're currently on.
 * @param {string} target - The server you want to hack
 * @param {string[]} servers - The list of servers you have access to.
 * @returns The route from source to target.
 */
export function findServer(ns: NS, source: string, target: string, servers: string[]): string[] {
  servers.push(source);

  for (const server of ns.scan(source)) {
    if (server === target) {
      servers.push(server);
      return servers;
    }

    if (!servers.includes(server)) {
      const route = findServer(ns, server, target, servers.slice());
      if (route[route.length - 1] === target) {
        return route;
      }
    }
  }

  return servers;
}

/**
 * It calculates the chance of a player hacking a server based on the player's hacking skill, the
 * server's hack difficulty, and the player's hacking chance multiplier
 * @param {Server} server - The server you're hacking
 * @param {Player} player - The player object
 * @returns The chance of hacking a server.
 */
export function calculateHackingChance(server: ServerInfo, player: Player): number {
  const hackFactor = 1.75;
  const difficultyMult = (100 - server.security.level) / 100;
  const skillMult = hackFactor * player.hacking;
  const skillChance = (skillMult - server.hackLevel) / skillMult;
  const chance = skillChance * difficultyMult * player.hacking_chance_mult;

  if (chance > 1) {
    return 1;
  }
  if (chance < 0) {
    return 0;
  }

  return chance;
}

/**
 * Evaluate if the server can be hacked or not
 * @param {NS} ns - Netscript API
 * @param {Server} server - The server that you're trying to hack.
 * @returns true if player hacking level is higher than the server required skill.
 */
export function canHack(ns: NS, server: Server): boolean {
  return ns.getHackingLevel() >= server.requiredHackingSkill;
}

/**
 * It takes the servers data, filters out the servers that are purchased or that are too hard
 * to hack, then it calculates the hacking chance for each server
 * @param {NS} ns - NS
 * @returns The server with the highest hacking chance / max money
 */
export function findBestServerToHack(ns: NS): string {
  const player = ns.getPlayer();
  const serversData = getServersInfos(ns);

  const data = serversData.filter((server) => !server.purchased || server.hackLevel > ns.getHackingLevel());

  const serverDetails = [];

  for (const server of data) {
    const serverName = server.hostname;
    const chance: number = Math.round(((calculateHackingChance(server, player) * 100) + Number.EPSILON) * 100) / 100;
    const maxMoney = server.money.max;
    serverDetails.push({
      name: serverName,
      hackingChance: chance,
      money: maxMoney,
    });
  }

  const bestServer = serverDetails.reduce((prev, curr) => {
    if (prev.hackingChance > curr.hackingChance) return prev;

    if (prev.hackingChance === curr.hackingChance) {
      if (prev.money > curr.money) {
        return prev;
      }
      return curr;
    }
    return curr;
  });

  return bestServer.name;
}
