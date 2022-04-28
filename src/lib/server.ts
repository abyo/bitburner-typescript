import { NS, Server } from '@ns';
import {
  ServerMoney, ServerPorts, ServerRam, ServerSecurity,
} from '/compiler/types';

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
  get logRam(): number { return Math.max(0, Math.log2(this.data.maxRam)); }
  get purchased(): boolean { return (this.data.purchasedByPlayer && this.data.hostname !== 'home'); }
  get hackLevel(): number { return this.data.requiredHackingSkill; }

  get ports(): ServerPorts {
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

  get ram(): ServerRam {
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

  calculateThreadCount(scriptRamUsage: number): number {
    return Math.floor(this.ram.free / scriptRamUsage);
  }

  penetrate(): void {
    try {
      this.ns.nuke(this.hostname);
    } catch (e) {
      this.ns.print(e);
    }

    try {
      this.ns.brutessh(this.hostname);
      this.ns.ftpcrack(this.hostname);
      this.ns.relaysmtp(this.hostname);
      this.ns.httpworm(this.hostname);
      this.ns.sqlinject(this.hostname);
    } catch (e) {
      this.ns.print(e);
    }
  }
}
