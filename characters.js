// ===== Shared character roster data =====
// Used by both Roster.html (character list) and Match_3_game.html (battlefield).
//
// Shared combat rules (see each character's abilityText for their unique effect):
//   - Basic Attack: 3 mana -> 1 damage (every character).
//   - Special Attack (characters marked isSpecial=true / "*"): 5 mana -> 2 damage,
//     OR their unique ability in place of plain damage.
//   - Melee must usually clear the front line to reach back-line Ranged units
//     (see the battlefield's per-lane protection system).
//
// simpleAbility: a short tag the battle code checks to apply a small number of
// straightforward, already-implemented effects (flat damage/mana modifiers with
// no new game state). Every other unique ability is DESCRIBED here but not yet
// mechanically implemented -- using that character's Special currently just
// deals the standard 5 mana -> 2 damage. See DECISIONS.md / TODO.md for the
// full list of what's wired up vs. deferred.
//
// simpleAbility values currently implemented by the battle code:
//   'frenzy'        - after dealing damage, gain 1 free mana (Korr)
//   'cheapBasic2'   - Basic Attack costs 2 mana instead of 3 (Kael, Lumi)
//   'divineStrike'  - +1 damage if the target is already damaged (Rorik)
//   'brutal'        - +1 damage if the target has <=3 HP (Brick)

const CHARACTERS = [
  // ---------------- Barbarian ----------------
  {
    id: 'korr', name: 'Korr the Unbroken', title: 'Berserker', class: 'Barbarian',
    type: 'melee', hp: 7, color: 'red', damageType: 'Physical', weapon: 'Greataxe',
    isSpecial: true, abilityName: 'Frenzy',
    abilityText: 'After you deal damage, gain 1 free mana.',
    simpleAbility: 'frenzy'
  },
  {
    id: 'sylra', name: 'Sylra Thornblood', title: 'Wild Fury', class: 'Barbarian',
    type: 'melee', hp: 6, color: 'green', damageType: 'Physical + Nature', weapon: 'Clawed gauntlets',
    isSpecial: true, abilityName: 'Wild Surge',
    abilityText: 'Your next attack also damages an adjacent enemy.',
    simpleAbility: null
  },

  // ---------------- Bard ----------------
  {
    id: 'vesper_quill', name: 'Vesper Quill', title: 'Lore', class: 'Bard',
    type: 'ranged', hp: 4, color: 'blue', damageType: 'Magical', weapon: 'Songbook',
    isSpecial: false, abilityName: 'Knowledge',
    abilityText: 'When you match 4+ of your color, all allies gain 1 mana.',
    simpleAbility: null
  },
  {
    id: 'joren', name: 'Captain Joren Brightsong', title: 'Victory', class: 'Bard',
    type: 'ranged', hp: 4, color: 'yellow', damageType: 'Magical', weapon: 'War-horn',
    isSpecial: true, abilityName: 'Inspire',
    abilityText: 'Your attack also gives one ally +1 damage on their next hit.',
    simpleAbility: null
  },

  // ---------------- Cleric ----------------
  {
    id: 'mireya', name: 'Sister Mireya', title: 'Life', class: 'Cleric',
    type: 'ranged', hp: 5, color: 'green', damageType: 'Magical', weapon: 'Holy symbol',
    isSpecial: true, abilityName: 'Mend',
    abilityText: 'Instead of damage, restore 2 HP to an ally.',
    simpleAbility: null
  },
  {
    id: 'caelum', name: 'Brother Caelum', title: 'Light', class: 'Cleric',
    type: 'ranged', hp: 4, color: 'yellow', damageType: 'Magical', weapon: 'Lantern-staff',
    isSpecial: true, abilityName: 'Radiance',
    abilityText: 'Attack ignores one front-line blocker.',
    simpleAbility: null
  },
  {
    id: 'rorik', name: 'Templar Rorik Ironvow', title: 'War', class: 'Cleric',
    type: 'melee', hp: 7, color: 'red', damageType: 'Physical', weapon: 'Warhammer',
    isSpecial: true, abilityName: 'Divine Strike',
    abilityText: '+1 damage if the target is already damaged.',
    simpleAbility: 'divineStrike'
  },

  // ---------------- Druid ----------------
  {
    id: 'toren', name: 'Toren Ashpelt', title: 'Shifter', class: 'Druid',
    type: 'melee', hp: 6, color: 'green', damageType: 'Physical', weapon: 'Beast claws',
    isSpecial: true, abilityName: 'Wild Shape',
    abilityText: 'Once per battle, gain +2 HP and +1 damage for the rest of the fight.',
    simpleAbility: null
  },
  {
    id: 'elowen', name: 'Elowen Greenveil', title: 'Leaf', class: 'Druid',
    type: 'ranged', hp: 4, color: 'green', damageType: 'Magical', weapon: 'Living vine staff',
    isSpecial: true, abilityName: 'Entangle',
    abilityText: "Attack also reduces the target's next attack damage by 1.",
    simpleAbility: null
  },

  // ---------------- Fighter ----------------
  {
    id: 'lira', name: 'Lira Voss', title: 'Spell Blade', class: 'Fighter',
    type: 'melee', hp: 6, color: 'blue', damageType: 'Physical + Arcane', weapon: 'Runed sword',
    isSpecial: true, abilityName: 'Arcane Edge',
    abilityText: 'Spend 1 extra mana to deal 1 additional damage.',
    simpleAbility: null
  },
  {
    id: 'kael', name: 'Master Kael Dualedge', title: 'Weapon Master', class: 'Fighter',
    type: 'melee', hp: 6, color: 'red', damageType: 'Physical', weapon: 'Twin blades',
    isSpecial: false, abilityName: 'Precise',
    abilityText: 'Your basic attacks cost only 2 mana.',
    simpleAbility: 'cheapBasic2'
  },

  // ---------------- Mechanist ----------------
  {
    id: 'cogwright', name: 'Cogwright Jex', title: null, class: 'Mechanist',
    type: 'ranged', hp: 5, color: 'yellow', damageType: 'Physical', weapon: 'Deployable tools / crossbow',
    isSpecial: true, abilityName: 'Gadget',
    abilityText: 'Once per turn, create a 1-HP blocker in front of an ally.',
    simpleAbility: null
  },

  // ---------------- Monk ----------------
  {
    id: 'shade', name: 'Shade', title: 'Flickering Dark', class: 'Monk',
    type: 'melee', hp: 5, color: 'purple', damageType: 'Physical', weapon: 'Shadow-wrapped fists',
    isSpecial: true, abilityName: 'Shadow Step',
    abilityText: 'Attack can target any enemy (ignores front line).',
    simpleAbility: null
  },
  {
    id: 'huan', name: 'Master Huan', title: 'Open Hand', class: 'Monk',
    type: 'melee', hp: 5, color: 'blue', damageType: 'Physical', weapon: 'Bare hands',
    isSpecial: true, abilityName: 'Stunning Strike',
    abilityText: 'Attack also prevents the target from acting next turn.',
    simpleAbility: null
  },

  // ---------------- Paladin ----------------
  {
    id: 'alaric', name: 'Sir Alaric the Pure', title: 'Devotion', class: 'Paladin',
    type: 'melee', hp: 7, color: 'yellow', damageType: 'Physical + Holy', weapon: 'Blessed longsword',
    isSpecial: true, abilityName: 'Aegis',
    abilityText: 'When you attack, one ally takes 1 less damage this turn.',
    simpleAbility: null
  },
  {
    id: 'vara', name: 'Inquisitor Vara Blackscale', title: 'Justice', class: 'Paladin',
    type: 'melee', hp: 6, color: 'yellow', damageType: 'Physical + Holy', weapon: 'Smiting mace',
    isSpecial: true, abilityName: 'Smite',
    abilityText: '+2 damage against enemies that have killed an ally.',
    simpleAbility: null
  },

  // ---------------- Ranger ----------------
  {
    id: 'rook', name: 'Rook Redfeather', title: 'Hunter', class: 'Ranger',
    type: 'ranged', hp: 4, color: 'red', damageType: 'Physical', weapon: 'Longbow',
    isSpecial: true, abilityName: 'Marked Prey',
    abilityText: 'Your attacks deal +1 damage to the same target until it dies.',
    simpleAbility: null
  },
  {
    id: 'fen', name: 'Fen the Packbrother', title: 'Pack Master', class: 'Ranger',
    type: 'ranged', hp: 4, color: 'green', damageType: 'Physical', weapon: 'Hunting bow',
    isSpecial: true, abilityName: 'Pack Call',
    abilityText: 'Summon a 2-HP wolf that attacks once then disappears.',
    simpleAbility: null
  },

  // ---------------- Rogue ----------------
  {
    id: 'brick', name: 'Brick', title: 'Enforcer', class: 'Rogue',
    type: 'melee', hp: 6, color: 'red', damageType: 'Physical', weapon: 'Heavy cudgel',
    isSpecial: true, abilityName: 'Brutal',
    abilityText: 'If the target has 3 HP or less, deal 1 extra damage.',
    simpleAbility: 'brutal'
  },
  {
    id: 'whisper', name: 'Whisper', title: 'Thief', class: 'Rogue',
    type: 'melee', hp: 4, color: 'purple', damageType: 'Physical', weapon: 'Daggers',
    isSpecial: true, abilityName: 'Backstab',
    abilityText: '+1 damage if attacking from the side or after a match of 4+.',
    simpleAbility: null
  },

  // ---------------- Sorcerer ----------------
  {
    id: 'nyx', name: 'Nyx the Unraveling', title: 'Chaos', class: 'Sorcerer',
    type: 'ranged', hp: 3, color: 'purple', damageType: 'Magical', weapon: 'Chaotic focus',
    isSpecial: true, abilityName: 'Wild Magic',
    abilityText: '50% chance your attack deals 1 extra damage or hits a random extra target.',
    simpleAbility: null
  },
  {
    id: 'saryn', name: 'Saryn Flamecrest', title: 'Draconic', class: 'Sorcerer',
    type: 'ranged', hp: 4, color: 'red', damageType: 'Magical', weapon: 'Dragonfire',
    isSpecial: true, abilityName: 'Breath',
    abilityText: 'Attack hits the entire column (both front and back).',
    simpleAbility: null
  },

  // ---------------- Warlock ----------------
  {
    id: 'drax', name: 'Drax Hellbound', title: 'Fiend', class: 'Warlock',
    type: 'ranged', hp: 4, color: 'red', damageType: 'Magical', weapon: 'Hellfire pact',
    isSpecial: true, abilityName: 'Dark Gift',
    abilityText: 'After attacking, gain 1 temporary HP.',
    simpleAbility: null
  },
  {
    id: 'morrigan', name: 'Morrigan Soulreap', title: 'Reaper', class: 'Warlock',
    type: 'ranged', hp: 3, color: 'purple', damageType: 'Magical', weapon: 'Soul scythe',
    isSpecial: true, abilityName: 'Harvest',
    abilityText: 'If you kill a target, gain 2 mana.',
    simpleAbility: null
  },

  // ---------------- Wizard ----------------
  {
    id: 'torvin', name: 'Archmage-Sergeant Torvin', title: 'Battle Mage', class: 'Wizard',
    type: 'melee', hp: 5, color: 'blue', damageType: 'Physical + Arcane', weapon: 'Spell-sword',
    isSpecial: true, abilityName: 'Spellstrike',
    abilityText: 'Your basic attack also deals 1 damage to an adjacent enemy.',
    simpleAbility: null
  },
  {
    id: 'lumi', name: 'Apprentice Lumi', title: 'Cantrip Adept', class: 'Wizard',
    type: 'ranged', hp: 3, color: 'blue', damageType: 'Magical', weapon: 'Wand',
    isSpecial: false, abilityName: 'Efficient',
    abilityText: 'Basic attacks cost only 2 mana.',
    simpleAbility: 'cheapBasic2'
  },

  // ---------------- Theurge ----------------
  {
    id: 'elias', name: 'Elias Bridge', title: 'Conduit', class: 'Theurge',
    type: 'ranged', hp: 4, color: 'blue', damageType: 'Magical', weapon: 'Twin foci',
    isSpecial: true, abilityName: 'Dual Channel',
    abilityText: 'When you match your color, also give 1 mana to one other ally.',
    simpleAbility: null
  },
  {
    id: 'seraphine', name: 'Seraphine Dawn', title: 'Illuminary', class: 'Theurge',
    type: 'ranged', hp: 4, color: 'yellow', damageType: 'Magical', weapon: 'Radiant orb',
    isSpecial: true, abilityName: 'Illuminate',
    abilityText: 'Attack also reveals / removes one enemy blocker effect.',
    simpleAbility: null
  },
  {
    id: 'quill_weaver', name: 'Quill the Weaver', title: 'Source Spinner', class: 'Theurge',
    type: 'ranged', hp: 3, color: 'purple', damageType: 'Magical', weapon: 'Raw-magic spindle',
    isSpecial: true, abilityName: 'Weave',
    abilityText: 'Convert 2 mana of any color into 3 of your own.',
    simpleAbility: null
  },

  // ---------------- Witch ----------------
  {
    id: 'mara', name: 'Bloodwitch Mara', title: 'Crimson Cord', class: 'Witch',
    type: 'ranged', hp: 4, color: 'red', damageType: 'Magical', weapon: 'Blood-bound dagger',
    isSpecial: true, abilityName: 'Blood Price',
    abilityText: 'Spend 1 HP to deal +2 damage.',
    simpleAbility: null
  },
  {
    id: 'oracle_vesper', name: 'Oracle Vesper', title: 'Sibylline Sight', class: 'Witch',
    type: 'ranged', hp: 3, color: 'purple', damageType: 'Magical', weapon: 'Divining mirror',
    isSpecial: true, abilityName: 'Foresight',
    abilityText: 'Once per battle, force an enemy attack to miss.',
    simpleAbility: null
  },
  {
    id: 'stella', name: 'Stella Nightveil', title: 'Silver Star', class: 'Witch',
    type: 'ranged', hp: 4, color: 'yellow', damageType: 'Magical', weapon: 'Starlight charm',
    isSpecial: true, abilityName: 'Celestial Curse',
    abilityText: "Attack also reduces the target's max HP by 1 for the battle.",
    simpleAbility: null
  },

  // ---------------- Vanguard ----------------
  {
    id: 'stonewall', name: 'Captain Stonewall', title: 'Bulwark', class: 'Vanguard',
    type: 'melee', hp: 8, color: 'yellow', damageType: 'Physical', weapon: 'Tower shield + spear',
    isSpecial: true, abilityName: 'Hold the Line',
    abilityText: 'All adjacent allies take 1 less damage this turn.',
    simpleAbility: null
  },
  {
    id: 'lyssa', name: 'Banner-Bearer Lyssa', title: 'Herald', class: 'Vanguard',
    type: 'ranged', hp: 5, color: 'yellow', damageType: 'Magical', weapon: 'Command banner',
    isSpecial: true, abilityName: 'Rally',
    abilityText: 'All allies gain 1 mana.',
    simpleAbility: null
  },
  {
    id: 'corvin', name: 'Strategist Corvin', title: 'Marshal', class: 'Vanguard',
    type: 'ranged', hp: 4, color: 'blue', damageType: 'Magical', weapon: 'Tactical baton',
    isSpecial: true, abilityName: 'Direct',
    abilityText: 'One ally may immediately make a free basic attack.',
    simpleAbility: null
  },

  // ---------------- Mercenary (plain troops, no special ability) ----------------
  // basicCost/basicDmg below are optional per-character overrides for the
  // Basic Attack (default: BASIC_COST/BASIC_DMG). Only Grommash and Harkon
  // use them here, for a heavier/costlier basic swing than the norm.
  {
    id: 'kael_ironwood', name: 'Kael Ironwood', title: null, class: 'Mercenary',
    type: 'melee', hp: 6, color: 'yellow', damageType: 'Physical', weapon: 'Longsword',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null
  },
  {
    id: 'rurik', name: 'Brother Rurik', title: null, class: 'Mercenary',
    type: 'melee', hp: 7, color: 'red', damageType: 'Physical', weapon: 'Warhammer',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null
  },
  {
    id: 'grommash', name: 'Grommash the Red', title: null, class: 'Mercenary',
    type: 'melee', hp: 7, color: 'red', damageType: 'Physical', weapon: 'Greataxe',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null,
    basicCost: 6, basicDmg: 2
  },
  {
    id: 'sera_vey', name: 'Sera Vey', title: null, class: 'Mercenary',
    type: 'melee', hp: 5, color: 'green', damageType: 'Physical', weapon: 'Spear',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null
  },
  {
    id: 'tomas_dualedge', name: 'Tomas Dualedge', title: null, class: 'Mercenary',
    type: 'melee', hp: 5, color: 'blue', damageType: 'Physical', weapon: 'Shortsword',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null
  },
  {
    id: 'lira_swiftarrow', name: 'Lira Swiftarrow', title: null, class: 'Mercenary',
    type: 'ranged', hp: 4, color: 'green', damageType: 'Physical', weapon: 'Longbow',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null
  },
  {
    id: 'harkon', name: 'Harkon Bolt', title: null, class: 'Mercenary',
    type: 'ranged', hp: 5, color: 'purple', damageType: 'Physical', weapon: 'Heavy Crossbow',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null,
    basicCost: 6, basicDmg: 2
  },
  {
    id: 'mira', name: 'Mira Quietshot', title: null, class: 'Mercenary',
    type: 'ranged', hp: 4, color: 'blue', damageType: 'Physical', weapon: 'Light Crossbow',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null
  },
  {
    id: 'fen_willow', name: 'Fen Willow', title: null, class: 'Mercenary',
    type: 'ranged', hp: 4, color: 'yellow', damageType: 'Physical', weapon: 'Shortbow',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null
  },
  {
    id: 'vex', name: 'Vex Needle', title: null, class: 'Mercenary',
    type: 'ranged', hp: 3, color: 'purple', damageType: 'Physical', weapon: 'Hand Crossbow',
    isSpecial: false, abilityName: null, abilityText: null, simpleAbility: null
  }
];

// ---- Shared combat constants ----
const BASIC_COST = 3;
const BASIC_DMG = 1;
const SPECIAL_COST = 5;
const SPECIAL_DMG = 2;

// A character's actual Basic Attack cost/damage. Defaults to BASIC_COST/
// BASIC_DMG; a character may override with its own `basicCost`/`basicDmg`
// fields (e.g. a heavier weapon that costs more mana for more damage), or
// get a flat discount via simpleAbility: 'cheapBasic2' (2 mana, same 1 dmg).
// Explicit basicCost always wins over the cheapBasic2 shortcut.
function basicCostFor(charDef) {
  if (charDef.basicCost != null) return charDef.basicCost;
  return charDef.simpleAbility === 'cheapBasic2' ? 2 : BASIC_COST;
}
function basicDmgFor(charDef) {
  return charDef.basicDmg != null ? charDef.basicDmg : BASIC_DMG;
}

// A character's mana cap = the highest cost among the abilities they can
// use. Baseline is SPECIAL_COST for Heroes (isSpecial) or BASIC_COST for
// everyone else, same as always — but if a character's own Basic Attack
// costs more than that baseline (an explicit `basicCost` override), the cap
// is raised to match, so they can actually reach the mana their attack needs.
function maxManaFor(charDef) {
  const baseline = charDef.isSpecial ? SPECIAL_COST : BASIC_COST;
  return charDef.basicCost != null ? Math.max(baseline, charDef.basicCost) : baseline;
}

// Node/browser export shim (both Roster.html and Match_3_game.html load this
// as a plain <script src="characters.js"> — the module.exports branch only
// matters for headless testing with Node/jsdom).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHARACTERS, BASIC_COST, BASIC_DMG, SPECIAL_COST, SPECIAL_DMG, maxManaFor, basicCostFor, basicDmgFor };
}
