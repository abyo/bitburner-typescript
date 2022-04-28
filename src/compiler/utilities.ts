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
