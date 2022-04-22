import { NS } from '@ns';

function range(start: number, end: number, step = 1): number[] {
  const arr = [];
  for (let i = start; i < end; i += step) {
    arr.push(i);
  }
  return arr;
}

function calcHnetMoneyRate(level: number, ram: number, cores: number, mult: number): number {
  const levelMult = level * 1.5;
  const ramMult = 1.035 ** (ram - 1);
  const coresMult = (cores + 5) / 6;
  return levelMult * ramMult * coresMult * mult;
}

function calculateMedianNodeRate(ns: NS, nodes: number[]): number {
  const totalLevel: number[] = [];
  const totalRam: number[] = [];
  const totalCore: number[] = [];
  const nodesNumber: number = ns.hacknet.numNodes();

  for (const node of nodes) {
    const { level, ram, cores } = ns.hacknet.getNodeStats(node);
    totalLevel.push(level);
    totalRam.push(ram);
    totalCore.push(cores);
  }

  const medianLevel = totalLevel.reduce((a, b) => a + b, 0) / nodesNumber;
  const medianRam = totalRam.reduce((a, b) => a + b, 0) / nodesNumber;
  const medianCore = totalCore.reduce((a, b) => a + b, 0) / nodesNumber;

  const nodeMedianRate = calcHnetMoneyRate(
    medianLevel,
    medianRam,
    medianCore,
    ns.getPlayer().hacknet_node_money_mult,
  );

  return nodeMedianRate;
}

export default async function main(ns: NS): Promise<void> {
  ns.disableLog('sleep');

  while (true) {
    const playerMult = ns.getPlayer().hacknet_node_money_mult;
    const playerMoney = ns.getPlayer().money;
    const nodes = range(0, ns.hacknet.numNodes());
    const nodeStats = [];

    const nodePurchaseCost = ns.hacknet.getPurchaseNodeCost();
    const nodePurchaseRate = calculateMedianNodeRate(ns, nodes);

    nodeStats.push({
      name: 'node',
      cost: nodePurchaseCost,
      ratio: nodePurchaseRate / nodePurchaseCost,
    });

    for (const node of nodes) {
      const {
        level, ram, cores, production,
      } = ns.hacknet.getNodeStats(node);

      const levelUpgradeCost = ns.hacknet.getLevelUpgradeCost(node, 1);
      const ramUpgradeCost = ns.hacknet.getRamUpgradeCost(node, 1);
      const coreUpgradeCost = ns.hacknet.getCoreUpgradeCost(node, 1);

      const levelUpgradeRate = calcHnetMoneyRate(level + 1, ram, cores, playerMult) - production;
      const ramUpgradeRate = calcHnetMoneyRate(level, ram + 1, cores, playerMult) - production;
      const coreUpgradeRate = calcHnetMoneyRate(level, ram, cores + 1, playerMult) - production;

      nodeStats.push(
        {
          name: 'level',
          core: node,
          cost: levelUpgradeCost,
          ratio: levelUpgradeRate / levelUpgradeCost,
        },
        {
          name: 'ram',
          core: node,
          cost: ramUpgradeCost,
          ratio: ramUpgradeRate / ramUpgradeCost,
        },
        {
          name: 'core',
          core: node,
          cost: coreUpgradeCost,
          ratio: coreUpgradeRate / coreUpgradeCost,
        },
      );
    }

    nodeStats.sort((a, b) => b.ratio - a.ratio);
    const upgrade = nodeStats[0];

    if (upgrade.cost > playerMoney) ns.print('Not enough money for the upgrade (hacknet)!');

    if (upgrade.name === 'level') {
      ns.hacknet.upgradeLevel(upgrade.core as number, 1);
    } else if (upgrade.name === 'ram') {
      ns.hacknet.upgradeRam(upgrade.core as number, 1);
    } else if (upgrade.name === 'core') {
      ns.hacknet.upgradeCore(upgrade.core as number, 1);
    } else if (upgrade.name === 'node') {
      ns.hacknet.purchaseNode();
    }

    await ns.sleep(1);
  }
}
