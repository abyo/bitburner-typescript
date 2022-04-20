import { NS } from "@ns";

/**
 * Given a start, end, and step, return an array of numbers from start to end, incrementing by step.
 * @param {number} start - The first number in the sequence.
 * @param {number} end - The end of the range.
 * @param {number} [step=1] - The step value. Default is 1.
 * @returns An array of numbers from start to end, with a step of 1.
 */
function range(start: number, end: number, step = 1): number[] {
  const arr = [];
  for (let i = start; i < end; i += step) {
    arr.push(i);
  }
  return arr;
}

function calculateHnetMoneyRate(
  level: number,
  ram: number,
  cores: number
): number {
  const levelMult = level * 1.5;
  const ramMult = Math.pow(1.035, ram - 1);
  const coresMult = (cores + 5) / 6;
  return levelMult * ramMult * coresMult;
}

export async function main(ns: NS): Promise<void> {
  ns.disableLog("sleep");

  while (true) {
    const playerMoney = ns.getPlayer().money;
    const playerMult = ns.getPlayer().hacknet_node_money_mult;
    const nodes = range(0, ns.hacknet.numNodes());
    const nodeStats = [];

    const nodePurchaseCost = ns.hacknet.getPurchaseNodeCost();
    const nodePurchaseRate = calculateHnetMoneyRate(100, 3, 7) * playerMult;

    nodeStats.push({
      name: "node",
      cost: nodePurchaseCost,
      ratio: nodePurchaseRate / nodePurchaseCost,
    });

    for (const node of nodes) {
      const { level, ram, cores, production } = ns.hacknet.getNodeStats(node);

      const levelUpgradeCost = ns.hacknet.getLevelUpgradeCost(node, 1);
      const ramUpgradeCost = ns.hacknet.getRamUpgradeCost(node, 1);
      const coreUpgradeCost = ns.hacknet.getCoreUpgradeCost(node, 1);

      const levelUpgradeRate =
        calculateHnetMoneyRate(level + 1, ram, cores) * playerMult - production;
      const ramUpgradeRate =
        calculateHnetMoneyRate(level, ram + 1, cores) * playerMult - production;
      const coreUpgradeRate =
        calculateHnetMoneyRate(level, ram, cores + 1) * playerMult - production;

      nodeStats.push(
        {
          name: "level",
          core: node,
          cost: levelUpgradeCost,
          ratio: levelUpgradeRate / levelUpgradeCost,
        },
        {
          name: "ram",
          core: node,
          cost: ramUpgradeCost,
          ratio: ramUpgradeRate / ramUpgradeCost,
        },
        {
          name: "core",
          core: node,
          cost: coreUpgradeCost,
          ratio: coreUpgradeRate / coreUpgradeCost,
        }
      );
    }

    nodeStats.sort((a, b) => b.ratio - a.ratio);
    const upgrade = nodeStats[0];

    ns.tprint(upgrade);

    if (upgrade.cost > playerMoney) ns.print("Not enough money to upgrade!");

    if (upgrade.name === "level") {
      ns.hacknet.upgradeLevel(upgrade.core, 1);
    } else if (upgrade.name === "ram") {
      ns.hacknet.upgradeRam(upgrade.core, 1);
    } else if (upgrade.name === "core") {
      ns.hacknet.upgradeCore(upgrade.core, 1);
    } else if (upgrade.name === "node") {
      ns.hacknet.purchaseNode();
    } else {
      continue;
    }

    await ns.sleep(1);
  }
}
