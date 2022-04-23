import { NS, Server } from '@ns';

interface Ports {
  required: number
  open: number
  ftp: boolean
  http: boolean
  smtp: boolean
  sql: boolean
  ssh: boolean
}

interface Ram {
  used: number
  max: number
  free: number
}

interface ServerSecurity {
  level: number
  base: number
  min: number
}

interface ServerMoney {
  available: number
  max: number
  growth: number
}

export class ServerInfo {
  constructor(public ns: NS, public host: string) {
    this.ns = ns;
    this.host = host;
  }

  get data(): Server { return this.ns.getServer(this.host); }
  get admin(): boolean { return this.data.hasAdminRights; }
  get hostname(): string { return this.data.hostname; }
  get ip(): string { return this.data.ip; }
  get cores(): number { return this.data.cpuCores; }
  get organization(): string { return this.data.organizationName; }
  get connected(): boolean { return this.data.isConnectedTo; }
  get backdoor(): boolean { return this.data.backdoorInstalled; }
  get purchased(): boolean { return (this.data.purchasedByPlayer && this.data.hostname !== 'home'); }
  get hackLevel(): number { return this.data.requiredHackingSkill; }

  get ports(): Ports {
    return {
      required: this.data.numOpenPortsRequired,
      open: this.data.openPortCount,
      ftp: this.data.ftpPortOpen,
      http: this.data.httpPortOpen,
      smtp: this.data.smtpPortOpen,
      sql: this.data.sqlPortOpen,
      ssh: this.data.sshPortOpen,
    };
  }

  get ram(): Ram {
    return {
      used: this.data.ramUsed,
      max: this.data.maxRam,
      free: this.data.maxRam - this.data.ramUsed,
    };
  }

  get security(): ServerSecurity {
    return {
      level: this.data.hackDifficulty,
      base: this.data.baseDifficulty,
      min: this.data.minDifficulty,
    };
  }

  get money(): ServerMoney {
    return {
      available: this.data.moneyAvailable,
      max: this.data.moneyMax,
      growth: this.data.serverGrowth,
    };
  }
}

export function main(ns: NS): void {
  const server = new ServerInfo(ns, 'n00dles');
  ns.tprint(server.ports.required);
}
