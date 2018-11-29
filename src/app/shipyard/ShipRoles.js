import * as ModuleUtils from './ModuleUtils';
import { Modifications } from 'coriolis-data/dist';
import { canMount } from '../utils/SlotFunctions';
import { getBlueprint, setPercent } from '../utils/BlueprintFunctions';

/**
 * Standard / typical role for multi-purpose or combat (if shielded with better bulkheads)
 * @param {Ship} ship             Ship instance
 * @param {Boolean} shielded      True if shield generator should be included
 * @param {integer} bulkheadIndex Bulkhead to use see Constants.BulkheadNames
 */
export function multiPurpose(ship, shielded, bulkheadIndex) {
  ship.useStandard('A')
    .use(ship.standard[3], ModuleUtils.standard(3, ship.standard[3].maxClass + 'D'))  // D Life Support
    .use(ship.standard[5], ModuleUtils.standard(5, ship.standard[5].maxClass + 'D'))  // D Sensors
    .useBulkhead(bulkheadIndex);

  if (shielded) {
    ship.internal.some(function(slot) {
      if (canMount(ship, slot, 'sg')) { // Assuming largest slot can hold an eligible shield
        ship.use(slot, ModuleUtils.findInternal('sg', slot.maxClass, 'A'));
        ship.setSlotEnabled(slot, true);
        return true;
      }
    });
  }
}

/**
 * Distant Worlds 2 role
 * Tiers:
 * 1- Max. Jump Range, Unshielded
 * 2- Max. Jump Range, Minimal Shields
 * 3- Max. Jump Range, Optimal Shields
 * 4- Max. Jump Range, Optimal Shields & Thrusters
 *
 * Engineering level:
 * No engineering
 * Only Felicity Farseer and Elvira Martuuk
 * All exploration related engineers
 *
 * Role
 * Exploration
 * Surface exploration
 * Big Rig, full mining
 * Saper / Prospector mining
 * Fuel rat
 * Repair rat
 * Mechanic
 * Trucker
 *
 * @param ship {Ship} Ship instance
 * @param tier {Number}
 * @param engineeringLevel {Number}
 * @param role {String}
 * @param gfsb {Boolean} add Guardian FSD Booster
 * @param gpp {Boolean} add Guardian Power Plant
 * @param fighter {Boolean} add fighter if supported
 */
export function dw2Build(ship, tier, engineeringLevel, role, gfsb, gpp, fighter) {
  let standardOpts = { ppRating: 'D', pd: 'd3' };
  ship
    .emptyInternal()
    .emptyHardpoints()
    .emptyUtility();
  const fsd = ModuleUtils.findStandard('fsd', ship.standard[2].maxClass, 'A');
  ship.use(ship.standard[2], fsd);
  ship.use(ship.standard[3], ModuleUtils.findStandard('ls', ship.standard[3].maxClass, 'D'));
  ship.use(ship.standard[4], ModuleUtils.findStandard('pd', 1, 'D'));
  ship.use(ship.standard[5], ModuleUtils.findStandard('s', ship.standard[5].maxClass, 'D'));
  const fuelNeeded = ship.standard[2].m.maxfuel * 2;
  const fuelTank = ship.availCS.standard[6]
    .filter(e => e.fuel)
    .filter(e => e.fuel >= fuelNeeded);
  ship.use(ship.standard[6], fuelTank[0]);
  ship.useBulkhead(0, false);
  if (engineeringLevel === 2) {
    const bp = getBlueprint('FSD_LongRange', ship.standard[2]);
    bp.grade = 5;
    bp.special = Modifications.specials['special_fsd_heavy'];
    ship.standard[2].m.blueprint = bp;
    setPercent(ship, ship.standard[2].m, 100);
    // Sensors G3 LW
    const sBP = getBlueprint('Sensor_Sensor_LightWeight', ship.standard[5]);
    sBP.grade = 3;
    ship.standard[5].m.blueprint = sBP;
    setPercent(ship, ship.standard[5].m, 100);
  } else if (engineeringLevel === 3) {
    // Armour G5 HD + Deep Plating
    const armourBP = getBlueprint('Armour_HeavyDuty', ship.bulkheads);
    armourBP.grade = 5;
    armourBP.special = Modifications.specials['special_armour_chunky'];
    ship.bulkheads.m.blueprint = armourBP;
    setPercent(ship, ship.bulkheads.m, 100);
    // FSD G5 IR + Mass Manager
    const fsdBP = getBlueprint('FSD_LongRange', ship.standard[2]);
    fsdBP.grade = 5;
    fsdBP.special = Modifications.specials['special_fsd_heavy'];
    ship.standard[2].m.blueprint = fsdBP;
    setPercent(ship, ship.standard[2].m, 100);
    // LS G4 LW
    const lsBP = getBlueprint('LifeSupport_LightWeight', ship.standard[3]);
    lsBP.grade = 4;
    ship.standard[3].m.blueprint = lsBP;
    setPercent(ship, ship.standard[3].m, 100);
    // Sensors G5 LW
    const sBP = getBlueprint('Sensor_Sensor_LightWeight', ship.standard[5]);
    sBP.grade = 5;
    ship.standard[5].m.blueprint = sBP;
    setPercent(ship, ship.standard[5].m, 100);
  }

  if (ship.id === 'alliance_chieftain' || ship.id === 'imperial_clipper') {
    const fs = ModuleUtils.findInternal('fs', 4, 'A');
    const slot = ship.internal.filter(a => a.maxClass === 4)[0];
    ship.use(slot, fs);
  } else if (ship.id === 'imperial_cutter') {
    const fs = ModuleUtils.findInternal('fs', 6, 'A');
    const slot = ship.internal.filter(a => a.maxClass === 6)[0];
    ship.use(slot, fs);
  } else if (fsd.class === 2 && fsd.rating === 'A') {
    let fs = ModuleUtils.findInternal('fs', 2, 'A');
    let slot = ship.internal.filter(a => a.maxClass >= 2).filter(a => a.maxClass >= fs.class)
      .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
      [0];
    if (slot.m) {
      fs = ModuleUtils.findInternal('fs', 1, 'A');
      slot = ship.internal.filter(a => a.maxClass === 1)[0];
      ship.use(slot, fs);
    } else {
      ship.use(slot, fs);
    }
  } else if (fsd.class === 3 && fsd.rating === 'A') {
    let fs = ModuleUtils.findInternal('fs', 3, 'B');
    let slot = ship.internal.filter(a => a.maxClass >= 3).filter(a => a.maxClass >= fs.class)
      .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
      [0];
    if (slot.m) {
      fs = ModuleUtils.findInternal('fs', 2, 'A');
      slot = ship.internal.filter(a => a.maxClass === 2)[0];
      ship.use(slot, fs);
    } else {
      ship.use(slot, fs);
    }
  } else if (fsd.class === 4 && fsd.rating === 'A') {
    let fs = ModuleUtils.findInternal('fs', 4, 'b');
    let slot = ship.internal.filter(a => a.maxClass >= 4).filter(a => a.maxClass >= fs.class)
      .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
      [0];
    if (slot.m) {
      fs = ModuleUtils.findInternal('fs', 3, 'A');
      slot = ship.internal.filter(a => a.maxClass === 3)[0];
      ship.use(slot, fs);
    } else {
      ship.use(slot, fs);
    }
  } else if (fsd.class === 5 && fsd.rating === 'A') {
    let fs = ModuleUtils.findInternal('fs', 5, 'B');
    let slot = ship.internal.filter(a => a.maxClass >= 5).filter(a => a.maxClass >= fs.class)
      .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
      [0];
    if (slot.m) {
      fs = ModuleUtils.findInternal('fs', 4, 'A');
      slot = ship.internal.filter(a => a.maxClass === 4).filter(a => a.maxClass >= fs.class)
        .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
        [0];
      ship.use(slot, fs);
    } else {
      ship.use(slot, fs);
    }
  } else if (fsd.class === 6 && fsd.rating === 'A') {
    let fs = ModuleUtils.findInternal('fs', 6, 'B');
    let slot = ship.internal.filter(a => a.maxClass >= 6)
      .filter(a => a.maxClass >= fs.class)
      .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
      [0];
    if (slot.m) {
      fs = ModuleUtils.findInternal('fs', 5, 'A');
      slot = ship.internal.filter(a => a.maxClass === 5)[0];
      ship.use(slot, fs);
    } else {
      ship.use(slot, fs);
    }
  } else if (fsd.class === 7 && fsd.rating === 'A') {
    let fs = ModuleUtils.findInternal('fs', 7, 'B');
    let slot = ship.internal.filter(a => a.maxClass >= 7).filter(a => a.maxClass >= fs.class)
      .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
      [0];
    if (slot.m) {
      fs = ModuleUtils.findInternal('fs', 6, 'A');
      slot = ship.internal.filter(a => a.maxClass === 6)[0];
      ship.use(slot, fs);
    } else {
      ship.use(slot, fs);
    }
  }

  if (tier !== 1) {
    const fuelNeeded = ship.standard[2].m.maxfuel * 3;
    const fuelTank = ship.availCS.standard[6]
      .filter(e => e.fuel)
      .filter(e => e.fuel >= fuelNeeded);
    ship.use(ship.standard[6], fuelTank[0]);
  }

  if (tier === 2) {
    if (ship.id === 'alliance_chieftain' || ship.id === 'alliance_crusader' || ship.id === 'federal_gunship' || ship.id === 'vulture') {
      const hrp = ModuleUtils.findInternal('hrp', 3, 'D');
      const slot = ship.internal.filter(e => e.eligible && e.maxClass === 3);
      ship.use(slot, hrp);
    } else {
      const sg = ship.getAvailableModules().lightestShieldGenerator(ship.ladenMass);
      const slot = ship.internal.filter(a => !a.m)
        .filter(a => a.maxClass >= sg.class)
        .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
        [0];
      ship.use(slot, sg);
      if (engineeringLevel === 2) {
        // ELP G3
        const shieldBP = getBlueprint('ShieldGenerator_Optimised', ship.findShieldGenerator());
        shieldBP.grade = 3;
        ship.findShieldGenerator().blueprint = shieldBP;
        setPercent(ship, ship.findShieldGenerator(), 100);
      } else if (engineeringLevel === 3) {
        // ELP G5
        const shieldBP = getBlueprint('ShieldGenerator_Optimised', ship.findShieldGenerator());
        shieldBP.grade = 5;
        ship.findShieldGenerator().blueprint = shieldBP;
        setPercent(ship, ship.findShieldGenerator(), 100);
      }
      // const shieldOrder = [1, 2, 3, 4, 5, 6, 7, 8].reverse();
      // const shieldInternals = ship.internal.filter(a => !a.m)
      // .filter(a => (!a.eligible) || a.eligible.sg)
      // .filter(a => a.maxClass >= sg.class)
      // .sort((a, b) => shieldOrder.indexOf(a.maxClass) - shieldOrder.indexOf(b.maxClass));
      // for (let i = 0; i < shieldInternals.length; i++) {
      //   if (canMount(ship, shieldInternals[i], 'sg')) {
      //     ship.use(shieldInternals[i], sg);
      //     break;
      //   }
      // }
    }
  } else if (tier === 3 || tier === 4) {
    const sg = ship.getAvailableModules().lightestShieldGenerator(ship.hullMass, 'A');
    const slot = ship.internal.filter(a => !a.m)
      .filter(a => a.maxClass >= sg.class)
      .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
      [0];
    ship.use(slot, sg);
    if (engineeringLevel === 1) {
      // ELP G3
      const shieldBP = getBlueprint('ShieldGenerator_Optimised', ship.findShieldGenerator());
      shieldBP.grade = 3;
      shieldBP.special = Modifications.specials['special_shield_lightweight'];
      ship.findShieldGenerator().blueprint = shieldBP;
      setPercent(ship, ship.findShieldGenerator(), 100);
    } else if (engineeringLevel === 2) {
      // ELP G5
      const shieldBP = getBlueprint('ShieldGenerator_Optimised', ship.findShieldGenerator());
      shieldBP.grade = 5;
      shieldBP.special = Modifications.specials['special_shield_lightweight'];
      ship.findShieldGenerator().blueprint = shieldBP;
      setPercent(ship, ship.findShieldGenerator(), 100);
    }
  }

  if (tier === 4) {
    let t;
    if (canMount(ship, ship.standard[1], 't', ship.standard[1].maxClass - 1)) {
      t = ModuleUtils.findStandard('t', ship.standard[1].maxClass - 1, 'A');
    } else {
      t = ModuleUtils.findStandard('t', ship.standard[1].maxClass, 'A');
    }
    ship.use(ship.standard[1], t);
    if (engineeringLevel === 1) {
      // DD G3
      const tBP = getBlueprint('Engine_Dirty', ship.standard[1]);
      tBP.grade = 3;
      tBP.special = Modifications.specials['special_engine_lightweight'];
      ship.standard[1].m.blueprint = tBP;
      setPercent(ship, ship.standard[1].m, 100);
    } else if (engineeringLevel === 2) {
      // DD G5
      const tBP = getBlueprint('Engine_Dirty', ship.standard[1]);
      tBP.grade = 5;
      tBP.special = Modifications.specials['special_engine_lightweight'];
      ship.standard[1].m.blueprint = tBP;
      setPercent(ship, ship.standard[1].m, 100);
    }
  }

  if (tier !== 4) {
    if (engineeringLevel === 3) {
      const pd = ship.availCS.standard[4]
        .filter(d => d.rating === 'D')
        .filter(d => (d.engcap * 1.728) >= ship.boostEnergy)
        .sort((a, b) => a.class.toString().localeCompare(b.class.toString()))[0];

      ship.use(ship.standard[4], pd);
      // CE G5
      const pdBP = getBlueprint('PowerDistributor_HighFrequency', ship.standard[4]);
      pdBP.grade = 5;
      pdBP.special = Modifications.specials['special_powerdistributor_capacity'];
      ship.standard[4].m.blueprint = pdBP;
      setPercent(ship, ship.standard[4].m, 100);
    } else {
      const pd = ship.availCS.standard[4]
        .filter(d => d.rating === 'D')
        .filter(d => d.engcap >= ship.boostEnergy)
        .sort((a, b) => a.class.toString().localeCompare(b.class.toString()))[0]
        [0];
      ship.use(ship.standard[4], pd);
    }
  } else {
    if (engineeringLevel === 3) {
      const pd = ship.availCS.standard[4]
        .filter(d => d.rating === 'D')
        .sort((a, b) => b.class.toString().localeCompare(a.class.toString()))[0];

      ship.use(ship.standard[4], pd);
      // CE G5
      const pdBP = getBlueprint('PowerDistributor_HighFrequency', ship.standard[4]);
      pdBP.grade = 5;
      pdBP.special = Modifications.specials['special_powerdistributor_capacity'];
      ship.standard[4].m.blueprint = pdBP;
      setPercent(ship, ship.standard[4].m, 100);
    } else {
      const pd = ship.availCS.standard[4]
        .filter(d => d.rating === 'D')
        .sort((a, b) => b.class.toString().localeCompare(a.class.toString()))[0];

      ship.use(ship.standard[4], pd);
    }
  }

  if (ship.fighterHangars && fighter) {
    const slot = ship.internal.filter(s => s.maxClass >= 5 && !s.m)
      .sort((a, b) => a.maxClass.toString().localeCompare(b.maxClass.toString()))
      [0];
    if (slot) {
      const mod = ModuleUtils.findInternal('fh', 5, 'D');
      ship.use(slot, mod);
    }
  }

  const pp = ship.getAvailableModules().lightestPowerPlant(Math.max(ship.powerRetracted, ship.powerDeployed), 'A');
  const t = ship.getAvailableModules().lightestThruster(ship.ladenMass);
  ship.use(ship.standard[0], pp);
  ship.use(ship.standard[1], t);

  // ship.useLightestStandard(standardOpts);
  ship.updatePowerGenerated()
    .updatePowerUsed()
    .recalculateMass()
    .updateJumpStats()
    .recalculateShield()
    .recalculateShieldCells()
    .recalculateArmour()
    .recalculateDps()
    .recalculateEps()
    .recalculateHps()
    .updateMovement()
    .updateModificationsString();
}

/**
 * Trader Role
 * @param  {Ship} ship            Ship instance
 * @param  {Boolean} shielded     True if shield generator should be included
 * @param  {Object} standardOpts  [Optional] Standard module optional overrides
 */
export function trader(ship, shielded, standardOpts) {
  let usedSlots = [];
  let bstCount = 2;
  let sg = ship.getAvailableModules().lightestShieldGenerator(ship.hullMass);
  ship.useStandard('A')
    .use(ship.standard[3], ModuleUtils.standard(3, ship.standard[3].maxClass + 'D'))  // D Life Support
    .use(ship.standard[1], ModuleUtils.standard(1, ship.standard[1].maxClass + 'D'))  // D Power Plant
    .use(ship.standard[4], ModuleUtils.standard(4, ship.standard[4].maxClass + 'D'))  // D Life Support
    .use(ship.standard[5], ModuleUtils.standard(5, ship.standard[5].maxClass + 'D'));  // D Sensors

  const shieldOrder = [1, 2, 3, 4, 5, 6, 7, 8];
  const shieldInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.sg)
    .filter(a => a.maxClass >= sg.class)
    .sort((a, b) => shieldOrder.indexOf(a.maxClass) - shieldOrder.indexOf(b.maxClass));
  shieldInternals.some(function(slot) {
    if (canMount(ship, slot, 'sg')) { // Assuming largest slot can hold an eligible shield
      const shield = ModuleUtils.findInternal('sg', slot.maxClass, 'A');
      if (shield && shield.maxmass > ship.hullMass) {
        ship.use(slot, shield);
        ship.setSlotEnabled(slot, true);
        usedSlots.push(slot);
        return true;
      }
    }
  });

  // Fill the empty internals with cargo racks
  for (let i = ship.internal.length; i--;) {
    let slot = ship.internal[i];
    if (usedSlots.indexOf(slot) == -1 && canMount(ship, slot, 'cr')) {
      ship.use(slot, ModuleUtils.findInternal('cr', slot.maxClass, 'E'));
    }
  }

  // Empty the hardpoints
  for (let s of ship.hardpoints) {
    ship.use(s, null);
  }
  for (let s of ship.hardpoints) {
    if (s.maxClass == 0 && bstCount) {       // Mount up to 2 boosters
      ship.use(s, ModuleUtils.hardpoints('04'));
      bstCount--;
    } else {
      ship.use(s, null);
    }
  }
  // ship.useLightestStandard(standardOpts);
}

/**
 * Explorer Role
 * @param  {Ship} ship         Ship instance
 * @param  {Boolean} planetary True if Planetary Vehicle Hangar (PVH) should be included
 */
export function explorer(ship, planetary) {
  let standardOpts = { ppRating: 'A' },
    heatSinkCount = 2,  // Fit 2 heat sinks if possible
    usedSlots = [],
    sgSlot,
    fuelScoopSlot,
    sg = ship.getAvailableModules().lightestShieldGenerator(ship.hullMass);

  if (!planetary) { // Non-planetary explorers don't really need to boost
    standardOpts.pd = '1D';
  }

  // Cargo hatch can be disabled
  ship.setSlotEnabled(ship.cargoHatch, false);

  // Advanced Discovery Scanner - class 1 or higher
  const adsOrder = [1, 2, 3, 4, 5, 6, 7, 8];
  const adsInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.sc)
    .sort((a, b) => adsOrder.indexOf(a.maxClass) - adsOrder.indexOf(b.maxClass));
  for (let i = 0; i < adsInternals.length; i++) {
    if (canMount(ship, adsInternals[i], 'sc')) {
      ship.use(adsInternals[i], ModuleUtils.internal('2f'));
      usedSlots.push(adsInternals[i]);
      break;
    }
  }

  if (planetary) {
    // Planetary Vehicle Hangar - class 2 or higher
    const pvhOrder = [2, 3, 4, 5, 6, 7, 8, 1];
    const pvhInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
      .filter(a => (!a.eligible) || a.eligible.pv)
      .sort((a, b) => pvhOrder.indexOf(a.maxClass) - pvhOrder.indexOf(b.maxClass));
    for (let i = 0; i < pvhInternals.length; i++) {
      if (canMount(ship, pvhInternals[i], 'pv')) {
        // Planetary Vehical Hangar only has even classes
        const pvhClass = pvhInternals[i].maxClass % 2 === 1 ? pvhInternals[i].maxClass - 1 : pvhInternals[i].maxClass;
        ship.use(pvhInternals[i], ModuleUtils.findInternal('pv', pvhClass, 'G')); // G is lower mass
        ship.setSlotEnabled(pvhInternals[i], false);   // Disable power for Planetary Vehical Hangar
        usedSlots.push(pvhInternals[i]);
        break;
      }
    }
  }

  // Shield generator
  const shieldOrder = [1, 2, 3, 4, 5, 6, 7, 8];
  const shieldInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.sg)
    .filter(a => a.maxClass >= sg.class)
    .sort((a, b) => shieldOrder.indexOf(a.maxClass) - shieldOrder.indexOf(b.maxClass));
  for (let i = 0; i < shieldInternals.length; i++) {
    if (canMount(ship, shieldInternals[i], 'sg')) {
      ship.use(shieldInternals[i], sg);
      usedSlots.push(shieldInternals[i]);
      sgSlot = shieldInternals[i];
      break;
    }
  }

  // Detailed Surface Scanner
  const dssOrder = [1, 2, 3, 4, 5, 6, 7, 8];
  const dssInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.sc)
    .sort((a, b) => dssOrder.indexOf(a.maxClass) - dssOrder.indexOf(b.maxClass));
  for (let i = 0; i < dssInternals.length; i++) {
    if (canMount(ship, dssInternals[i], 'sc')) {
      ship.use(dssInternals[i], ModuleUtils.internal('2i'));
      usedSlots.push(dssInternals[i]);
      break;
    }
  }

  // Fuel scoop - best possible
  const fuelScoopOrder = [8, 7, 6, 5, 4, 3, 2, 1];
  const fuelScoopInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.fs)
    .sort((a, b) => fuelScoopOrder.indexOf(a.maxClass) - fuelScoopOrder.indexOf(b.maxClass));
  for (let i = 0; i < fuelScoopInternals.length; i++) {
    if (canMount(ship, fuelScoopInternals[i], 'fs')) {
      ship.use(fuelScoopInternals[i], ModuleUtils.findInternal('fs', fuelScoopInternals[i].maxClass, 'A'));
      usedSlots.push(fuelScoopInternals[i]);
      fuelScoopSlot = fuelScoopInternals[i];
      break;
    }
  }

  // AFMUs - fill as they are 0-weight
  const afmuOrder = [8, 7, 6, 5, 4, 3, 2, 1];
  const afmuInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.pc)
    .sort((a, b) => afmuOrder.indexOf(a.maxClass) - afmuOrder.indexOf(b.maxClass));
  for (let i = 0; i < afmuInternals.length; i++) {
    if (canMount(ship, afmuInternals[i], 'am')) {
      ship.use(afmuInternals[i], ModuleUtils.findInternal('am', afmuInternals[i].maxClass, 'A'));
      usedSlots.push(afmuInternals[i]);
      ship.setSlotEnabled(afmuInternals[i], false);   // Disable power for AFM Unit
    }
  }

  for (let s of ship.hardpoints) {
    if (s.maxClass == 0 && heatSinkCount) {       // Mount up to 2 heatsinks
      ship.use(s, ModuleUtils.hardpoints('02'));
      ship.setSlotEnabled(s, heatSinkCount == 2); // Only enable a single Heatsink
      heatSinkCount--;
    } else {
      ship.use(s, null);
    }
  }

  if (sgSlot && fuelScoopSlot) {
    // The SG and Fuel scoop to not need to be powered at the same time
    if (sgSlot.m.getPowerUsage() > fuelScoopSlot.m.getPowerUsage()) { // The Shield generator uses the most power
      ship.setSlotEnabled(fuelScoopSlot, false);
    } else {                                    // The Fuel scoop uses the most power
      ship.setSlotEnabled(sgSlot, false);
    }
  }

  ship.useLightestStandard(standardOpts);
}

/**
 * Miner Role
 * @param  {Ship} ship         Ship instance
 * @param  {Boolean} shielded  True if shield generator should be included
 */
export function miner(ship, shielded) {
  shielded = true;
  let standardOpts = { ppRating: 'A' },
    miningLaserCount = 2,
    usedSlots = [],
    sg = ship.getAvailableModules().lightestShieldGenerator(ship.hullMass);

  // Cargo hatch should be enabled
  ship.setSlotEnabled(ship.cargoHatch, true);

  // Largest possible refinery
  const refineryOrder = [4, 5, 6, 7, 8, 3, 2, 1];
  const refineryInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.rf)
    .sort((a, b) => refineryOrder.indexOf(a.maxClass) - refineryOrder.indexOf(b.maxClass));
  for (let i = 0; i < refineryInternals.length; i++) {
    if (canMount(ship, refineryInternals[i], 'rf')) {
      ship.use(refineryInternals[i], ModuleUtils.findInternal('rf', Math.min(refineryInternals[i].maxClass, 4), 'A'));
      usedSlots.push(refineryInternals[i]);
      break;
    }
  }

  // Prospector limpet controller - 3A if possible
  const prospectorOrder = [3, 4, 5, 6, 7, 8, 2, 1];
  const prospectorInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.pc)
    .sort((a, b) => prospectorOrder.indexOf(a.maxClass) - prospectorOrder.indexOf(b.maxClass));
  for (let i = 0; i < prospectorInternals.length; i++) {
    if (canMount(ship, prospectorInternals[i], 'pc')) {
      // Prospector only has odd classes
      const prospectorClass = prospectorInternals[i].maxClass % 2 === 0 ? prospectorInternals[i].maxClass - 1 : prospectorInternals[i].maxClass;
      ship.use(prospectorInternals[i], ModuleUtils.findInternal('pc', prospectorClass, 'A'));
      usedSlots.push(prospectorInternals[i]);
      break;
    }
  }

  // Shield generator if required
  if (shielded) {
    const shieldOrder = [1, 2, 3, 4, 5, 6, 7, 8];
    const shieldInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
      .filter(a => (!a.eligible) || a.eligible.sg)
      .filter(a => a.maxClass >= sg.class)
      .sort((a, b) => shieldOrder.indexOf(a.maxClass) - shieldOrder.indexOf(b.maxClass));
    for (let i = 0; i < shieldInternals.length; i++) {
      if (canMount(ship, shieldInternals[i], 'sg')) {
        ship.use(shieldInternals[i], sg);
        usedSlots.push(shieldInternals[i]);
        break;
      }
    }
  }

  // Dual mining lasers of highest possible class; remove anything else
  const miningLaserOrder = [2, 3, 4, 1, 0];
  const miningLaserHardpoints = ship.hardpoints.concat().sort(function(a, b) {
    return miningLaserOrder.indexOf(a.maxClass) - miningLaserOrder.indexOf(b.maxClass);
  });
  for (let s of miningLaserHardpoints) {
    if (s.maxClass >= 1 && miningLaserCount) {
      ship.use(s, ModuleUtils.hardpoints(s.maxClass >= 2 ? '2m' : '2l'));
      miningLaserCount--;
    } else {
      ship.use(s, null);
    }
  }

  // Number of collector limpets required to be active is a function of the size of the ship and the power of the lasers
  const miningLaserDps = ship.hardpoints.filter(h => h.m != null)
    .reduce(function(a, b) {
      return a + b.m.getDps();
    }, 0);
  // Find out how many internal slots we have, and their potential cargo size
  const potentialCargo = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.cr)
    .map(b => Math.pow(2, b.maxClass));
  // One collector for each 1.25 DPS, multiply by 1.25 for medium ships and 1.5 for large ships as they have further to travel
  // 0 if we only have 1 cargo slot, otherwise minium of 1 and maximum of 6 (excluding size modifier)
  const sizeModifier = ship.class == 2 ? 1.2 : ship.class == 3 ? 1.5 : 1;
  let collectorLimpetsRequired = potentialCargo.length == 1 ? 0 : Math.ceil(sizeModifier * Math.min(6, Math.floor(miningLaserDps / 1.25)));

  if (collectorLimpetsRequired > 0) {
    const collectorOrder = [1, 2, 3, 4, 5, 6, 7, 8];
    const collectorInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
      .filter(a => (!a.eligible) || a.eligible.cc)
      .sort((a, b) => collectorOrder.indexOf(a.maxClass) - collectorOrder.indexOf(b.maxClass));
    // Always keep at least 2 slots free for cargo racks (1 for shielded)
    for (let i = 0; i < collectorInternals.length - (shielded ? 1 : 2) && collectorLimpetsRequired > 0; i++) {
      if (canMount(ship, collectorInternals[i], 'cc')) {
        // Collector only has odd classes
        const collectorClass = collectorInternals[i].maxClass % 2 === 0 ? collectorInternals[i].maxClass - 1 : collectorInternals[i].maxClass;
        ship.use(collectorInternals[i], ModuleUtils.findInternal('cc', collectorClass, 'D'));
        usedSlots.push(collectorInternals[i]);
        collectorLimpetsRequired -= collectorInternals[i].m.maximum;
      }
    }
  }

  // Power distributor to power the mining lasers indefinitely
  const wepRateRequired = ship.hardpoints.filter(h => h.m != null)
    .reduce(function(a, b) {
      return a + b.m.getEps();
    }, 0);
  standardOpts.pd = ship.getAvailableModules().matchingPowerDist({ weprate: wepRateRequired }).id;

  // Fill the empty internals with cargo racks
  for (let i = ship.internal.length; i--;) {
    let slot = ship.internal[i];
    if (usedSlots.indexOf(slot) == -1 && canMount(ship, slot, 'cr')) {
      ship.use(slot, ModuleUtils.findInternal('cr', slot.maxClass, 'E'));
    }
  }

  ship.useLightestStandard(standardOpts);
}

/**
 * Racer Role
 * @param  {Ship} ship         Ship instance
 */
export function racer(ship) {
  let standardOpts = {},
    usedSlots = [],
    sgSlot,
    sg = ship.getAvailableModules().lightestShieldGenerator(ship.hullMass);

  // Cargo hatch can be disabled
  ship.setSlotEnabled(ship.cargoHatch, false);

  // Shield generator
  const shieldOrder = [1, 2, 3, 4, 5, 6, 7, 8];
  const shieldInternals = ship.internal.filter(a => usedSlots.indexOf(a) == -1)
    .filter(a => (!a.eligible) || a.eligible.sg)
    .filter(a => a.maxClass >= sg.class)
    .sort((a, b) => shieldOrder.indexOf(a.maxClass) - shieldOrder.indexOf(b.maxClass));
  for (let i = 0; i < shieldInternals.length; i++) {
    if (canMount(ship, shieldInternals[i], 'sg')) {
      ship.use(shieldInternals[i], sg);
      usedSlots.push(shieldInternals[i]);
      sgSlot = shieldInternals[i];
      break;
    }
  }

  // Empty the hardpoints
  for (let s of ship.hardpoints) {
    ship.use(s, null);
  }

  // Empty the internals
  for (let i = ship.internal.length; i--;) {
    let slot = ship.internal[i];
    if (usedSlots.indexOf(slot) == -1) {
      ship.use(slot, null);
    }
  }

  // Best thrusters
  if (ship.standard[1].maxClass === 3) {
    standardOpts.th = 'tz';
  } else if (ship.standard[1].maxClass === 2) {
    standardOpts.th = 'u0';
  } else {
    standardOpts.th = ship.standard[1].maxClass + 'A';
  }

  // Best power distributor for more boosting
  standardOpts.pd = ship.standard[4].maxClass + 'A';

  // Smallest possible FSD drive
  standardOpts.fsd = '2D';
  // Minimal fuel tank
  standardOpts.ft = '1C';

  // Disable nearly everything
  standardOpts.fsdDisabled = true;
  standardOpts.sDisabled = true;
  standardOpts.pdDisabled = true;
  standardOpts.lsDisabled = true;

  ship.useLightestStandard(standardOpts);

  // Apply engineering to each module
  // ship.standard[1].m.blueprint = getBlueprint('Engine_Dirty', ship.standard[0]);
  // ship.standard[1].m.blueprint.grade = 5;
  // setBest(ship, ship.standard[1].m);

  // ship.standard[3].m.blueprint = getBlueprint('LifeSupport_LightWeight', ship.standard[3]);
  // ship.standard[3].m.blueprint.grade = 4;
  // setBest(ship, ship.standard[3].m);

  // ship.standard[4].m.blueprint = getBlueprint('PowerDistributor_PriorityEngines', ship.standard[4]);
  // ship.standard[4].m.blueprint.grade = 3;
  // setBest(ship, ship.standard[4].m);

  // ship.standard[5].m.blueprint = getBlueprint('Sensor_Sensor_LightWeight', ship.standard[5]);
  // ship.standard[5].m.blueprint.grade = 5;
  // setBest(ship, ship.standard[5].m);
}
