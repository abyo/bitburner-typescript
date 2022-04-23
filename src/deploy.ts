import { NS } from '@ns';
import { ServerInfo } from '/lib/server';

/**
 * The function takes the current server and a set of servers. It then scans the current
 * server for connections, filters out connections that are already in the set, then adds all new
 * connections to it
 * @param {NS} ns - Netscript API.
 * @param {string} currentServer - the current server you're on
 * @param set - a set of all servers that have been visited
 * @returns an array of all servers names
 */
function getServersList(ns: NS, currentServer = 'home', set = new Set<string>()): string[] {
  let serverConnections: string[] = ns.scan(currentServer);
  serverConnections = serverConnections.filter((s) => !set.has(s));
  serverConnections.forEach((server) => {
    set.add(server);
    return getServersList(ns, server, set);
  });

  return Array.from(set.keys());
}

export async function main(ns: NS): Promise<void> {
  ns.disableLog('sleep');
  const servers = getServersList(ns);
  const serversData = [];

  for (const server of servers) {
    serversData.push(new ServerInfo(ns, server));
  }

  for (const server of serversData) {
    await ns.scp(['/bin/grow.js', '/bin/weaken.js', '/bin/hack.js'], 'home', server.hostname);
    await ns.sleep(10);
  }

  while (true) {
    for (const server of serversData) {
      if (server.admin) {
        const moneyThreshold = server.money.max * 0.75;
        const securityThreshold = server.security.min + 5;
        const canHack = ns.getHackingLevel() >= server.hackLevel;
        let availableThreads = server.calculateThreadCount(1.75);

        if (server.security.level > securityThreshold) {
          if (availableThreads > 0 && canHack) ns.exec('bin/weaken.js', server.hostname, availableThreads, server.hostname);
        } else if (server.money.available < moneyThreshold) {
          if (availableThreads > 0 && canHack) ns.exec('bin/grow.js', server.hostname, availableThreads, server.hostname);
        } else {
          availableThreads = server.calculateThreadCount(1.7);
          if (availableThreads > 0 && canHack) ns.exec('bin/hack.js', server.hostname, availableThreads, server.hostname);
        }
      } else {
        server.penetrate();
      }
      await ns.sleep(1);
    }
  }
}
