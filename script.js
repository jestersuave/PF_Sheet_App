// --- Global Bonus Data ---
const bonusTypes = [
  "Alchemical", "Armour", "Circumstance", "Competence", "Deflection",
  "Dodge", "Enhancement", "Inherent", "Insight", "Luck", "Morale",
  "Natural Armour", "Profane", "Racial", "Sacred", "Shield", "Size", "Trait"
];

let characterBonuses = [];

// --- Ability Scores ---
const coreBonusMappings = {
  "AC": { targetKey: "acTotal" },
  "Fortitude Save": { targetKey: "fortTotal" },
  "Reflex Save": { targetKey: "refTotal" },
  "Will Save": { targetKey: "willTotal" },
  "Attack Rolls": { targetKey: "Attack_rolls_general" }, // Unique key for general attack
  "Damage Rolls": { targetKey: "Damage_rolls_general" }, // Unique key for general damage
  "Initiative": { targetKey: "initiativeTotal" },
  "Strength Score": { targetKey: "strScore" },
  "Dexterity Score": { targetKey: "dexScore" },
  "Constitution Score": { targetKey: "conScore" },
  "Intelligence Score": { targetKey: "intScore" },
  "Wisdom Score": { targetKey: "wisScore" },
  "Charisma Score": { targetKey: "chaScore" }
};

const skillBonusMappings = {};

// Function to calculate ability modifier
function calculateAbilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

// Helper to get integer value from an element, defaulting to 0
function getIntValue(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const value = element.value !== undefined ? element.value : element.textContent;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// Helper to get selected values from a custom checkbox dropdown
function getSelectedStats(optionsContainerId) {
  const optionsContainer = document.getElementById(optionsContainerId);
  if (!optionsContainer) return [];
  const selectedCheckboxes = optionsContainer.querySelectorAll('input[type="checkbox"]:checked');
  return Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
}

// Helper to get the numerical value of an ability modifier span
function getAbilityModifierValue(modId) { // e.g., 'strMod', 'dexMod'
  const modSpan = document.getElementById(modId);
  if (modSpan) {
    return parseInt(modSpan.textContent, 10) || 0;
  }
  return 0;
}

// --- Ability Scores ---
const abilityScoreConfigs = [
  { scoreId: 'strScore', modId: 'strMod' },
  { scoreId: 'dexScore', modId: 'dexMod' },
  { scoreId: 'conScore', modId: 'conMod' },
  { scoreId: 'intScore', modId: 'intMod' },
  { scoreId: 'wisScore', modId: 'wisMod' },
  { scoreId: 'chaScore', modId: 'chaMod' }
];

// --- Skills ---
const skillConfigs = [
  { ranksId: 'acrobaticsRanks', abilityModId: 'dexMod', totalId: 'acrobaticsTotal', classSkillCheckboxId: 'acrobaticsClassSkillChk', classSkillTextId: 'acrobaticsClassSkillText', statSelectId: 'acrobaticsStatSelectDropdown', statSelectBtnId: 'acrobaticsStatSelectBtn', defaultStatKey: 'dex' },
  { ranksId: 'appraiseRanks', abilityModId: 'intMod', totalId: 'appraiseTotal', classSkillCheckboxId: 'appraiseClassSkillChk', classSkillTextId: 'appraiseClassSkillText', statSelectId: 'appraiseStatSelectDropdown', statSelectBtnId: 'appraiseStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'bluffRanks', abilityModId: 'chaMod', totalId: 'bluffTotal', classSkillCheckboxId: 'bluffClassSkillChk', classSkillTextId: 'bluffClassSkillText', statSelectId: 'bluffStatSelectDropdown', statSelectBtnId: 'bluffStatSelectBtn', defaultStatKey: 'cha' },
  { ranksId: 'climbRanks', abilityModId: 'strMod', totalId: 'climbTotal', classSkillCheckboxId: 'climbClassSkillChk', classSkillTextId: 'climbClassSkillText', statSelectId: 'climbStatSelectDropdown', statSelectBtnId: 'climbStatSelectBtn', defaultStatKey: 'str' },
  { ranksId: 'craftRanks', abilityModId: 'intMod', totalId: 'craftTotal', classSkillCheckboxId: 'craftClassSkillChk', classSkillTextId: 'craftClassSkillText', statSelectId: 'craftStatSelectDropdown', statSelectBtnId: 'craftStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'diplomacyRanks', abilityModId: 'chaMod', totalId: 'diplomacyTotal', classSkillCheckboxId: 'diplomacyClassSkillChk', classSkillTextId: 'diplomacyClassSkillText', statSelectId: 'diplomacyStatSelectDropdown', statSelectBtnId: 'diplomacyStatSelectBtn', defaultStatKey: 'cha' },
  { ranksId: 'disableDeviceRanks', abilityModId: 'dexMod', totalId: 'disableDeviceTotal', classSkillCheckboxId: 'disableDeviceClassSkillChk', classSkillTextId: 'disableDeviceClassSkillText', statSelectId: 'disableDeviceStatSelectDropdown', statSelectBtnId: 'disableDeviceStatSelectBtn', defaultStatKey: 'dex' },
  { ranksId: 'disguiseRanks', abilityModId: 'chaMod', totalId: 'disguiseTotal', classSkillCheckboxId: 'disguiseClassSkillChk', classSkillTextId: 'disguiseClassSkillText', statSelectId: 'disguiseStatSelectDropdown', statSelectBtnId: 'disguiseStatSelectBtn', defaultStatKey: 'cha' },
  { ranksId: 'escapeArtistRanks', abilityModId: 'dexMod', totalId: 'escapeArtistTotal', classSkillCheckboxId: 'escapeArtistClassSkillChk', classSkillTextId: 'escapeArtistClassSkillText', statSelectId: 'escapeArtistStatSelectDropdown', statSelectBtnId: 'escapeArtistStatSelectBtn', defaultStatKey: 'dex' },
  { ranksId: 'flyRanks', abilityModId: 'dexMod', totalId: 'flyTotal', classSkillCheckboxId: 'flyClassSkillChk', classSkillTextId: 'flyClassSkillText', statSelectId: 'flyStatSelectDropdown', statSelectBtnId: 'flyStatSelectBtn', defaultStatKey: 'dex' },
  { ranksId: 'handleAnimalRanks', abilityModId: 'chaMod', totalId: 'handleAnimalTotal', classSkillCheckboxId: 'handleAnimalClassSkillChk', classSkillTextId: 'handleAnimalClassSkillText', statSelectId: 'handleAnimalStatSelectDropdown', statSelectBtnId: 'handleAnimalStatSelectBtn', defaultStatKey: 'cha' },
  { ranksId: 'healRanks', abilityModId: 'wisMod', totalId: 'healTotal', classSkillCheckboxId: 'healClassSkillChk', classSkillTextId: 'healClassSkillText', statSelectId: 'healStatSelectDropdown', statSelectBtnId: 'healStatSelectBtn', defaultStatKey: 'wis' },
  { ranksId: 'intimidateRanks', abilityModId: 'chaMod', totalId: 'intimidateTotal', classSkillCheckboxId: 'intimidateClassSkillChk', classSkillTextId: 'intimidateClassSkillText', statSelectId: 'intimidateStatSelectDropdown', statSelectBtnId: 'intimidateStatSelectBtn', defaultStatKey: 'cha' },
  { ranksId: 'knowledgeArcanaRanks', abilityModId: 'intMod', totalId: 'knowledgeArcanaTotal', classSkillCheckboxId: 'knowledgeArcanaClassSkillChk', classSkillTextId: 'knowledgeArcanaClassSkillText', statSelectId: 'knowledgeArcanaStatSelectDropdown', statSelectBtnId: 'knowledgeArcanaStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'knowledgeDungeoneeringRanks', abilityModId: 'intMod', totalId: 'knowledgeDungeoneeringTotal', classSkillCheckboxId: 'knowledgeDungeoneeringClassSkillChk', classSkillTextId: 'knowledgeDungeoneeringClassSkillText', statSelectId: 'knowledgeDungeoneeringStatSelectDropdown', statSelectBtnId: 'knowledgeDungeoneeringStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'knowledgeEngineeringRanks', abilityModId: 'intMod', totalId: 'knowledgeEngineeringTotal', classSkillCheckboxId: 'knowledgeEngineeringClassSkillChk', classSkillTextId: 'knowledgeEngineeringClassSkillText', statSelectId: 'knowledgeEngineeringStatSelectDropdown', statSelectBtnId: 'knowledgeEngineeringStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'knowledgeGeographyRanks', abilityModId: 'intMod', totalId: 'knowledgeGeographyTotal', classSkillCheckboxId: 'knowledgeGeographyClassSkillChk', classSkillTextId: 'knowledgeGeographyClassSkillText', statSelectId: 'knowledgeGeographyStatSelectDropdown', statSelectBtnId: 'knowledgeGeographyStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'knowledgeHistoryRanks', abilityModId: 'intMod', totalId: 'knowledgeHistoryTotal', classSkillCheckboxId: 'knowledgeHistoryClassSkillChk', classSkillTextId: 'knowledgeHistoryClassSkillText', statSelectId: 'knowledgeHistoryStatSelectDropdown', statSelectBtnId: 'knowledgeHistoryStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'knowledgeLocalRanks', abilityModId: 'intMod', totalId: 'knowledgeLocalTotal', classSkillCheckboxId: 'knowledgeLocalClassSkillChk', classSkillTextId: 'knowledgeLocalClassSkillText', statSelectId: 'knowledgeLocalStatSelectDropdown', statSelectBtnId: 'knowledgeLocalStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'knowledgeNatureRanks', abilityModId: 'intMod', totalId: 'knowledgeNatureTotal', classSkillCheckboxId: 'knowledgeNatureClassSkillChk', classSkillTextId: 'knowledgeNatureClassSkillText', statSelectId: 'knowledgeNatureStatSelectDropdown', statSelectBtnId: 'knowledgeNatureStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'knowledgeNobilityRanks', abilityModId: 'intMod', totalId: 'knowledgeNobilityTotal', classSkillCheckboxId: 'knowledgeNobilityClassSkillChk', classSkillTextId: 'knowledgeNobilityClassSkillText', statSelectId: 'knowledgeNobilityStatSelectDropdown', statSelectBtnId: 'knowledgeNobilityStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'knowledgePlanesRanks', abilityModId: 'intMod', totalId: 'knowledgePlanesTotal', classSkillCheckboxId: 'knowledgePlanesClassSkillChk', classSkillTextId: 'knowledgePlanesClassSkillText', statSelectId: 'knowledgePlanesStatSelectDropdown', statSelectBtnId: 'knowledgePlanesStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'knowledgeReligionRanks', abilityModId: 'intMod', totalId: 'knowledgeReligionTotal', classSkillCheckboxId: 'knowledgeReligionClassSkillChk', classSkillTextId: 'knowledgeReligionClassSkillText', statSelectId: 'knowledgeReligionStatSelectDropdown', statSelectBtnId: 'knowledgeReligionStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'linguisticsRanks', abilityModId: 'intMod', totalId: 'linguisticsTotal', classSkillCheckboxId: 'linguisticsClassSkillChk', classSkillTextId: 'linguisticsClassSkillText', statSelectId: 'linguisticsStatSelectDropdown', statSelectBtnId: 'linguisticsStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'perceptionRanks', abilityModId: 'wisMod', totalId: 'perceptionTotal', classSkillCheckboxId: 'perceptionClassSkillChk', classSkillTextId: 'perceptionClassSkillText', statSelectId: 'perceptionStatSelectDropdown', statSelectBtnId: 'perceptionStatSelectBtn', defaultStatKey: 'wis' },
  { ranksId: 'performRanks', abilityModId: 'chaMod', totalId: 'performTotal', classSkillCheckboxId: 'performClassSkillChk', classSkillTextId: 'performClassSkillText', statSelectId: 'performStatSelectDropdown', statSelectBtnId: 'performStatSelectBtn', defaultStatKey: 'cha' },
  { ranksId: 'professionRanks', abilityModId: 'wisMod', totalId: 'professionTotal', classSkillCheckboxId: 'professionClassSkillChk', classSkillTextId: 'professionClassSkillText', statSelectId: 'professionStatSelectDropdown', statSelectBtnId: 'professionStatSelectBtn', defaultStatKey: 'wis' },
  { ranksId: 'rideRanks', abilityModId: 'dexMod', totalId: 'rideTotal', classSkillCheckboxId: 'rideClassSkillChk', classSkillTextId: 'rideClassSkillText', statSelectId: 'rideStatSelectDropdown', statSelectBtnId: 'rideStatSelectBtn', defaultStatKey: 'dex' },
  { ranksId: 'senseMotiveRanks', abilityModId: 'wisMod', totalId: 'senseMotiveTotal', classSkillCheckboxId: 'senseMotiveClassSkillChk', classSkillTextId: 'senseMotiveClassSkillText', statSelectId: 'senseMotiveStatSelectDropdown', statSelectBtnId: 'senseMotiveStatSelectBtn', defaultStatKey: 'wis' },
  { ranksId: 'sleightOfHandRanks', abilityModId: 'dexMod', totalId: 'sleightOfHandTotal', classSkillCheckboxId: 'sleightOfHandClassSkillChk', classSkillTextId: 'sleightOfHandClassSkillText', statSelectId: 'sleightOfHandStatSelectDropdown', statSelectBtnId: 'sleightOfHandStatSelectBtn', defaultStatKey: 'dex' },
  { ranksId: 'spellcraftRanks', abilityModId: 'intMod', totalId: 'spellcraftTotal', classSkillCheckboxId: 'spellcraftClassSkillChk', classSkillTextId: 'spellcraftClassSkillText', statSelectId: 'spellcraftStatSelectDropdown', statSelectBtnId: 'spellcraftStatSelectBtn', defaultStatKey: 'int' },
  { ranksId: 'stealthRanks', abilityModId: 'dexMod', totalId: 'stealthTotal', classSkillCheckboxId: 'stealthClassSkillChk', classSkillTextId: 'stealthClassSkillText', statSelectId: 'stealthStatSelectDropdown', statSelectBtnId: 'stealthStatSelectBtn', defaultStatKey: 'dex' },
  { ranksId: 'survivalRanks', abilityModId: 'wisMod', totalId: 'survivalTotal', classSkillCheckboxId: 'survivalClassSkillChk', classSkillTextId: 'survivalClassSkillText', statSelectId: 'survivalStatSelectDropdown', statSelectBtnId: 'survivalStatSelectBtn', defaultStatKey: 'wis' },
  { ranksId: 'swimRanks', abilityModId: 'strMod', totalId: 'swimTotal', classSkillCheckboxId: 'swimClassSkillChk', classSkillTextId: 'swimClassSkillText', statSelectId: 'swimStatSelectDropdown', statSelectBtnId: 'swimStatSelectBtn', defaultStatKey: 'str' },
  { ranksId: 'useMagicDeviceRanks', abilityModId: 'chaMod', totalId: 'useMagicDeviceTotal', classSkillCheckboxId: 'useMagicDeviceClassSkillChk', classSkillTextId: 'useMagicDeviceClassSkillText', statSelectId: 'useMagicDeviceStatSelectDropdown', statSelectBtnId: 'useMagicDeviceStatSelectBtn', defaultStatKey: 'cha' }
];

// --- Saving Throws, Attack, Defense Configs ---
const saveConfigs = [
  { baseId: 'fortBase', totalId: 'fortTotal', abilityModId: 'conMod', statSelectId: 'fortStatSelectDropdown', statSelectBtnId: 'fortStatSelectBtn', saveName: 'Fortitude', defaultStatKey: 'con' },
  { baseId: 'refBase', totalId: 'refTotal', abilityModId: 'dexMod', statSelectId: 'refStatSelectDropdown', statSelectBtnId: 'refStatSelectBtn', saveName: 'Reflex', defaultStatKey: 'dex' },
  { baseId: 'willBase', totalId: 'willTotal', abilityModId: 'wisMod', statSelectId: 'willStatSelectDropdown', statSelectBtnId: 'willStatSelectBtn', saveName: 'Will', defaultStatKey: 'wis' }
];

const attackConfigs = [
  { totalId: 'meleeAttack', babId: 'bab', primaryStatModId: 'strMod', sizeModId: 'sizeModAttack', statSelectId: 'meleeAttackStatSelectDropdown', statSelectBtnId: 'meleeAttackStatSelectBtn', defaultStatKey: 'str', name: "Melee Attack" },
  { totalId: 'rangedAttack', babId: 'bab', primaryStatModId: 'dexMod', sizeModId: 'sizeModAttack', statSelectId: 'rangedAttackStatSelectDropdown', statSelectBtnId: 'rangedAttackStatSelectBtn', defaultStatKey: 'dex', name: "Ranged Attack" }
];


const defenseConfig = {
  totalId: 'acTotal',
  dexModId: 'dexMod',
  armorBonusId: 'armorBonus',
  shieldBonusId: 'shieldBonus',
  sizeModAcId: 'sizeModAc',
  naturalArmorId: 'naturalArmor',
  deflectionModId: 'deflectionMod',
  miscAcBonusId: 'miscAcBonus',
  statSelectId: 'acStatSelectDropdown',
  statSelectBtnId: 'acStatSelectBtn',
  defaultStatKey: 'dex'
};

// --- Definitions that depend on skillConfigs ---
skillConfigs.forEach(skill => {
  const skillNamePart = skill.ranksId.replace('Ranks', '');
  let userFriendlyName = skillNamePart.replace(/([A-Z])/g, ' $1').trim();
  userFriendlyName = userFriendlyName.charAt(0).toUpperCase() + userFriendlyName.slice(1) + " Skill";
  if (userFriendlyName.startsWith("Knowledge ")) {
      const specificKnowledge = userFriendlyName.substring("Knowledge ".length).replace(" Skill", "");
      userFriendlyName = `Knowledge (${specificKnowledge}) Skill`;
  }
  skillBonusMappings[userFriendlyName] = { targetKey: skill.totalId };
});

const bonusTargetMappings = { ...coreBonusMappings, ...skillBonusMappings };
const bonusApplicationTargets = Object.keys(bonusTargetMappings);
// End of definitions that depend on skillConfigs ---

function getBonusesForTarget(targetKey) {
  let totalBonus = 0;
  const applicableBonusesByType = {};
  for (const bonus of characterBonuses) {
    let applies = false;
    for (const appliesToName of bonus.appliesTo) {
      if (bonusTargetMappings[appliesToName] && bonusTargetMappings[appliesToName].targetKey === targetKey) {
        applies = true;
        break;
      }
    }
    if (applies) {
      const bonusType = bonus.type;
      const bonusValue = parseInt(bonus.value, 10) || 0;
      if (bonusType === "Dodge" || bonusType === "Circumstance" || !bonusTypes.includes(bonusType)) {
        totalBonus += bonusValue;
      } else {
        if (!applicableBonusesByType[bonusType] || Math.abs(bonusValue) > Math.abs(applicableBonusesByType[bonusType].value)) {
          applicableBonusesByType[bonusType] = { value: bonusValue, type: bonusType };
        }
      }
    }
  }
  for (const type in applicableBonusesByType) {
    totalBonus += applicableBonusesByType[type].value;
  }
  return totalBonus;
}

function updateSkillTotal(skillRanksId, abilityModifierId, skillTotalId, statSelectContainerId) {
  const skillConfig = skillConfigs.find(sc => sc.totalId === skillTotalId || sc.ranksId === skillRanksId);
  if (!skillConfig || !skillConfig.classSkillCheckboxId || !skillConfig.classSkillTextId) {
    const originalRanks = getIntValue(skillRanksId);
    const originalAbilityMod = getAbilityModifierValue(abilityModifierId);
    const originalItemBonuses = typeof getBonusesForTarget === 'function' ? getBonusesForTarget(skillTotalId) : 0;
    const originalTotalSpan = document.getElementById(skillTotalId);
    if (originalTotalSpan) {
      originalTotalSpan.textContent = originalRanks + originalAbilityMod + originalItemBonuses;
    }
    return;
  }

  const ranks = getIntValue(skillRanksId);
  const primaryAbilityModifier = getAbilityModifierValue(abilityModifierId);
  const classSkillCheckbox = document.getElementById(skillConfig.classSkillCheckboxId);
  const classSkillTextSpan = document.getElementById(skillConfig.classSkillTextId);
  const totalSpan = document.getElementById(skillTotalId);
  let classSkillBonus = 0;
  if (classSkillCheckbox && classSkillCheckbox.checked && ranks >= 1) {
    classSkillBonus = 3;
  }
  if (classSkillTextSpan) {
    classSkillTextSpan.textContent = (classSkillCheckbox && classSkillCheckbox.checked) ? "Class Skill" : "";
  }
  const itemBonuses = getBonusesForTarget(skillTotalId);
  let dropdownStatBonus = 0;
  if (statSelectContainerId) {
    const selectedStats = getSelectedStats(statSelectContainerId); // Uses the new ID for checkbox container
    const defaultStatKeyForSkill = skillConfig.defaultStatKey;
    selectedStats.forEach(statKey => {
      if (statKey === 'doubleDefault') {
        dropdownStatBonus += getAbilityModifierValue(defaultStatKeyForSkill + 'Mod');
      } else if (statKey !== defaultStatKeyForSkill) {
        dropdownStatBonus += getAbilityModifierValue(statKey + 'Mod');
      }
    });
  }
  if (totalSpan) {
    totalSpan.textContent = ranks + primaryAbilityModifier + classSkillBonus + itemBonuses + dropdownStatBonus;
  } else {
    console.error(`Skill total span (ID: ${skillTotalId}) not found.`);
  }
}

function updateSavingThrows() {
  saveConfigs.forEach(config => {
    const baseValue = getIntValue(config.baseId);
    const primaryAbilityMod = getAbilityModifierValue(config.abilityModId);
    let dropdownStatBonus = 0;
    const selectedStats = getSelectedStats(config.statSelectId); // Uses new ID
    selectedStats.forEach(statKey => {
      if (statKey === 'doubleDefault') {
        dropdownStatBonus += getAbilityModifierValue(config.defaultStatKey + 'Mod');
      } else if (statKey !== config.defaultStatKey) {
        dropdownStatBonus += getAbilityModifierValue(statKey + 'Mod');
      }
    });
    const itemBonuses = getBonusesForTarget(config.totalId);
    const totalValue = baseValue + primaryAbilityMod + dropdownStatBonus + itemBonuses;
    const totalSpan = document.getElementById(config.totalId);
    if (totalSpan) {
      totalSpan.textContent = totalValue;
    }
  });
}

function updateCombatStats() {
  const conModForHp = getAbilityModifierValue('conMod');
  const hpBase = getIntValue('hpBase');
  document.getElementById('hpTotal').textContent = hpBase + conModForHp;

  const baseAc = 10;
  const dexModForAc = getAbilityModifierValue(defenseConfig.dexModId);
  const armorBonusField = getIntValue(defenseConfig.armorBonusId);
  const shieldBonusField = getIntValue(defenseConfig.shieldBonusId);
  const sizeModAc = getIntValue(defenseConfig.sizeModAcId);
  const naturalArmorField = getIntValue(defenseConfig.naturalArmorId);
  const deflectionModField = getIntValue(defenseConfig.deflectionModId);
  const miscAcBonus = getIntValue(defenseConfig.miscAcBonusId);
  const acBonusesFromBonusesSection = getBonusesForTarget(defenseConfig.totalId);
  let acDropdownBonus = 0;
  const selectedAcStats = getSelectedStats(defenseConfig.statSelectId); // Uses new ID
  selectedAcStats.forEach(statKey => {
    if (statKey === 'doubleDefault') {
      acDropdownBonus += getAbilityModifierValue(defenseConfig.defaultStatKey + 'Mod');
    } else if (statKey !== defenseConfig.defaultStatKey) {
      acDropdownBonus += getAbilityModifierValue(statKey + 'Mod');
    }
  });
  document.getElementById(defenseConfig.totalId).textContent = baseAc + dexModForAc + armorBonusField + shieldBonusField + sizeModAc + naturalArmorField + deflectionModField + miscAcBonus + acBonusesFromBonusesSection + acDropdownBonus;

  const generalAttackBonuses = getBonusesForTarget('Attack_rolls_general');
  attackConfigs.forEach(config => {
    const bab = getIntValue(config.babId);
    const primaryStatMod = getAbilityModifierValue(config.primaryStatModId);
    const sizeModAttack = getIntValue(config.sizeModId);
    let attackDropdownBonus = 0;
    const selectedAttackStats = getSelectedStats(config.statSelectId); // Uses new ID
    selectedAttackStats.forEach(statKey => {
      if (statKey === 'doubleDefault') {
        attackDropdownBonus += getAbilityModifierValue(config.defaultStatKey + 'Mod');
      } else if (statKey !== config.defaultStatKey) {
        attackDropdownBonus += getAbilityModifierValue(statKey + 'Mod');
      }
    });
    const totalAttack = bab + primaryStatMod + sizeModAttack + generalAttackBonuses + attackDropdownBonus;
    document.getElementById(config.totalId).textContent = totalAttack;
  });

  const strMod = getAbilityModifierValue('strMod');
  const dexMod = getAbilityModifierValue('dexMod');
  const babForCmbCmd = getIntValue('bab');
  const sizeModAttackForCmbCmd = getIntValue('sizeModAttack');
  const cmbBase = babForCmbCmd + strMod + sizeModAttackForCmbCmd;
  const cmdBase = 10 + babForCmbCmd + strMod + dexMod + sizeModAttackForCmbCmd;
  document.getElementById('cmbTotal').textContent = cmbBase + getBonusesForTarget('CMB');
  document.getElementById('cmdTotal').textContent = cmdBase + getBonusesForTarget('CMD');
  const initiativeDexMod = getAbilityModifierValue('dexMod');
  const initiativeMiscMod = getIntValue('initiativeMiscMod');
  const initiativeBonuses = getBonusesForTarget('initiativeTotal');
  document.getElementById('initiativeTotal').textContent = initiativeDexMod + initiativeMiscMod + initiativeBonuses;
}

function updateAllCharacterSheetCalculations() {
  console.log("[DEBUG] updateAllCharacterSheetCalculations called");
  abilityScoreConfigs.forEach(config => {
    const baseScore = getIntValue(config.scoreId);
    const scoreBonus = getBonusesForTarget(config.scoreId);
    const effectiveScore = baseScore + scoreBonus;
    const modSpan = document.getElementById(config.modId);
    if (modSpan) {
      modSpan.textContent = calculateAbilityModifier(effectiveScore);
    }
  });
  skillConfigs.forEach(skill => {
    updateSkillTotal(skill.ranksId, skill.abilityModId, skill.totalId, skill.statSelectId);
  });
  updateSavingThrows();
  updateCombatStats();
  console.log("[DEBUG] updateAllCharacterSheetCalculations completed");
}

// --- Custom Checkbox Dropdown Management ---
function updateStatSelectButtonText(btnId, optionsContainerId, defaultStatKey) {
  const button = document.getElementById(btnId);
  const selected = getSelectedStats(optionsContainerId);
  if (!button) return;

  if (selected.length === 0) {
    button.textContent = "Select Stats";
  } else if (selected.length === 1) {
    if (selected[0] === 'doubleDefault') {
      button.textContent = `Double Default (${defaultStatKey.toUpperCase()})`;
    } else {
      button.textContent = selected[0].toUpperCase();
    }
  } else {
    let text = "";
    let otherStatsCount = 0;
    let hasDoubleDefault = false;
    selected.forEach(stat => {
      if (stat === 'doubleDefault') {
        hasDoubleDefault = true;
      } else {
        if (otherStatsCount < 2) { // Show up to 2 specific stats
          text += (text ? ", " : "") + stat.toUpperCase();
        }
        otherStatsCount++;
      }
    });

    if (hasDoubleDefault) {
      text += (text ? ", " : "") + `DblDef(${defaultStatKey.toUpperCase()})`;
    }

    if (otherStatsCount > 2 && !hasDoubleDefault) { // If more than 2 non-DD stats, and no DD
        text = `${selected.length} Stats Selected`;
    } else if (otherStatsCount > 2 && hasDoubleDefault) { // More than 2 non-DD stats + DD
        text = `${otherStatsCount} Stats + DblDef`;
    } else if (otherStatsCount <=2 && selected.length > 2 && hasDoubleDefault) { // DD + 1 or 2 stats
        // Text already formatted correctly
    } else if (selected.length > 2 && !hasDoubleDefault) { // Should be caught by otherStatsCount > 2
        text = `${selected.length} Stats Selected`;
    }


    button.textContent = text || `${selected.length} Stats Selected`; // Fallback
  }
}


let currentlyOpenDropdown = null;

function initializeCustomDropdowns() {
  const allConfigs = [
    ...skillConfigs,
    ...saveConfigs,
    ...attackConfigs,
    defenseConfig // defenseConfig is an object, not an array
  ];

  allConfigs.forEach(config => { // This is the first outer loop
    if (!config.statSelectBtnId || !config.statSelectId) return;

    const button = document.getElementById(config.statSelectBtnId);
    const optionsContainer = document.getElementById(config.statSelectId);

    if (button && optionsContainer) {
      // Initial button text update
      updateStatSelectButtonText(config.statSelectBtnId, config.statSelectId, config.defaultStatKey);

      // Event listener for the dropdown button
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        // Close any other dropdown that might be open
        if (currentlyOpenDropdown && currentlyOpenDropdown !== optionsContainer) {
          currentlyOpenDropdown.style.display = 'none';
        }
        // Toggle current dropdown
        const isVisible = optionsContainer.style.display === 'block';
        optionsContainer.style.display = isVisible ? 'none' : 'block';
        currentlyOpenDropdown = isVisible ? null : optionsContainer;
      });

      // Event listeners for checkboxes within the dropdown
      const checkboxes = optionsContainer.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          updateStatSelectButtonText(config.statSelectBtnId, config.statSelectId, config.defaultStatKey);
          updateAllCharacterSheetCalculations(); // Ensure sheet updates on change
        });
      });
    }
  });

  // Global click listener to close dropdowns
  document.addEventListener('click', (event) => {
    if (currentlyOpenDropdown) {
      const isClickInsideButton = document.getElementById(currentlyOpenDropdown.id.replace("Dropdown", "Btn"))?.contains(event.target);
      const isClickInsideDropdown = currentlyOpenDropdown.contains(event.target);

      if (!isClickInsideButton && !isClickInsideDropdown) {
        currentlyOpenDropdown.style.display = 'none';
        currentlyOpenDropdown = null;
      }
    }
  });
}


// --- Webhook Function (existing, no changes needed for this task) ---
function sendToWebhook(webhookData) {
  const webhookUrl = localStorage.getItem('webhookUrl');
  if (!webhookUrl) { console.log('[Webhook] No webhook URL configured. Skipping send.'); return; }
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify(webhookData),
  })
  .then(response => {
    if (!response.ok) {
      response.text().then(text => { console.error('[Webhook] Error sending data:', response.status, response.statusText, text); });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  })
  .catch(error => { console.error('[Webhook] Failed to send data:', error); });
}

// --- Event Listeners & Initial Calculation ---
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  // --- Auth DOM Elements ---
  const authContainer = document.getElementById('auth-container');
  console.log('authContainer:', authContainer);
  const signupForm = document.getElementById('signup-form');
  console.log('signupForm:', signupForm);
  const signupEmailInput = document.getElementById('signup-email');
  console.log('signupEmailInput:', signupEmailInput);
  const signupPasswordInput = document.getElementById('signup-password');
  console.log('signupPasswordInput:', signupPasswordInput);
  // const signupButton = document.getElementById('signup-button'); // Already have this later, not strictly needed here if form is found
  // console.log('signupButton:', signupButton);
  const loginForm = document.getElementById('login-form');
  console.log('loginForm:', loginForm);
  const loginEmailInput = document.getElementById('login-email');
  console.log('loginEmailInput:', loginEmailInput);
  const loginPasswordInput = document.getElementById('login-password');
  console.log('loginPasswordInput:', loginPasswordInput);
  // const loginButton = document.getElementById('login-button');
  // console.log('loginButton:', loginButton);
  const googleLoginButton = document.getElementById('google-login-button'); // Added this
  console.log('googleLoginButton:', googleLoginButton); // Added this
  const logoutButton = document.getElementById('logout-button');
  console.log('logoutButton:', logoutButton);
  const emailVerificationMessageDiv = document.getElementById('email-verification-message');
  // Ensure emailVerificationMessageDiv is consistently available or handled if null
  if (!emailVerificationMessageDiv) {
    console.warn('Warning: email-verification-message element not found in the DOM. Some messages may not display.');
  }
  const sheetContainer = document.getElementById('sheet-container');
  console.log('sheetContainer:', sheetContainer);

  // --- Character Sheet Management DOM Elements ---
  const characterSheetManagementDiv = document.getElementById('character-sheet-management');
  console.log('characterSheetManagementDiv:', characterSheetManagementDiv);
  const saveSheetButton = document.getElementById('save-sheet-button');
  console.log('saveSheetButton:', saveSheetButton);
  const sheetNameInput = document.getElementById('sheet-name-input');
  console.log('sheetNameInput:', sheetNameInput);
  const loadSheetButton = document.getElementById('load-sheet-button');
  console.log('loadSheetButton (Refresh List):', loadSheetButton);
  const savedSheetsListDiv = document.getElementById('saved-sheets-list');
  console.log('savedSheetsListDiv:', savedSheetsListDiv);

  // Redundant declarations of signupButton and loginButton are removed here,
  // as they are already declared above or not strictly needed for this logging section.
  // const signupButton = document.getElementById('signup-button');
  // const loginButton = document.getElementById('login-button');
  // Note: The redundant block of const declarations that was here has been removed.

  const BASE_URL = 'http://127.0.0.1:5000';

  // --- User State Management ---
  function updateLoginState(isLoggedIn, userEmail = '', isVerified = false) {
    if (isLoggedIn) {
      if (authContainer) authContainer.style.display = 'none';
      if (logoutButton) logoutButton.style.display = 'block';
      if (sheetContainer) sheetContainer.style.display = 'block';
      if (characterSheetManagementDiv) characterSheetManagementDiv.style.display = 'block';

      // For now, login implies verification for UI purposes.
      // A more robust system would get verification status from backend.
      if (emailVerificationMessageDiv) emailVerificationMessageDiv.style.display = 'none';
      // if (!isVerified) {
      //   if (emailVerificationMessageDiv) {
      //     emailVerificationMessageDiv.innerHTML = `Please verify your email (${userEmail}). <button id='resend-verification-btn'>Resend verification</button>`;
      //     emailVerificationMessageDiv.style.display = 'block';
      //   }
      // } else {
      //   if (emailVerificationMessageDiv) emailVerificationMessageDiv.style.display = 'none';
      // }
      renderSavedSheets();
    } else { // Not logged in
      if (authContainer) authContainer.style.display = 'block';
      if (logoutButton) logoutButton.style.display = 'none';
      if (sheetContainer) sheetContainer.style.display = 'none';
      if (characterSheetManagementDiv) characterSheetManagementDiv.style.display = 'none';
      if (emailVerificationMessageDiv) emailVerificationMessageDiv.style.display = 'none';
      if (savedSheetsListDiv) savedSheetsListDiv.innerHTML = '';
      if (sheetNameInput) sheetNameInput.value = '';
    }
  }

  // Check initial login state
  // const storedToken = localStorage.getItem('userToken'); // Token not used yet
  const storedEmail = localStorage.getItem('userEmail');
  // const storedVerified = localStorage.getItem('isUserVerified') === 'true'; // Verification not fully implemented yet

  if (storedEmail) { // If email exists, assume logged in for now
    updateLoginState(true, storedEmail, true); // Assume verified on reload if email is present
  } else {
    updateLoginState(false);
  }

  // --- Auth Event Listeners ---
  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = signupEmailInput.value;
      const password = signupPasswordInput.value;

      if (!email || !password) {
        if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = 'Email and password are required.';
            emailVerificationMessageDiv.style.color = 'red';
            emailVerificationMessageDiv.style.display = 'block';
        }
        return;
      }

      // Basic email validation
      if (!email.includes('@') || !email.substring(email.indexOf('@')).includes('.')) {
        if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = 'Please enter a valid email address.';
            emailVerificationMessageDiv.style.color = 'red';
            emailVerificationMessageDiv.style.display = 'block';
        }
        return;
      }

      // Password length check
      if (password.length < 6) {
        if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = 'Password must be at least 6 characters long.';
            emailVerificationMessageDiv.style.color = 'red';
            emailVerificationMessageDiv.style.display = 'block';
        }
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = "Signup successful! Please log in.";
            emailVerificationMessageDiv.style.color = 'green';
            emailVerificationMessageDiv.style.display = 'block';
          }
          signupEmailInput.value = ''; // Clear form
          signupPasswordInput.value = '';
        } else {
          if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = data.message || 'Signup failed. Please try again.';
            emailVerificationMessageDiv.style.color = 'red';
            emailVerificationMessageDiv.style.display = 'block';
          }
        }
      } catch (error) {
        console.error('Signup error:', error);
        if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = 'An error occurred during signup. Please try again.';
            emailVerificationMessageDiv.style.color = 'red';
            emailVerificationMessageDiv.style.display = 'block';
        }
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = loginEmailInput.value;
      const password = loginPasswordInput.value;

      if (!email || !password) {
         if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = 'Email and password are required.';
            emailVerificationMessageDiv.style.color = 'red';
            emailVerificationMessageDiv.style.display = 'block';
         }
        return;
      }

      // Basic email validation
      if (!email.includes('@') || !email.substring(email.indexOf('@')).includes('.')) {
        if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = 'Please enter a valid email address.';
            emailVerificationMessageDiv.style.color = 'red';
            emailVerificationMessageDiv.style.display = 'block';
        }
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem('userEmail', email);
          // localStorage.setItem('userToken', data.token); // For future JWT token handling
          updateLoginState(true, email, true); // Assume verified on successful login for now
          if (emailVerificationMessageDiv) emailVerificationMessageDiv.style.display = 'none'; // Hide any previous messages
        } else {
          if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = data.message || 'Login failed. Please check your credentials.';
            emailVerificationMessageDiv.style.color = 'red';
            emailVerificationMessageDiv.style.display = 'block';
          }
          updateLoginState(false); // Ensure UI is in logged-out state
        }
      } catch (error) {
        console.error('Login error:', error);
        if (emailVerificationMessageDiv) {
            emailVerificationMessageDiv.textContent = 'An error occurred during login. Please try again.';
            emailVerificationMessageDiv.style.color = 'red';
            emailVerificationMessageDiv.style.display = 'block';
        }
        updateLoginState(false); // Ensure UI is in logged-out state
      }
    });
  }

  // Google Login Button
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', () => {
      // Redirect to Google OAuth endpoint on the backend
      window.location.href = `${BASE_URL}/login/google`;
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      // Attempt to call backend logout to clear HttpOnly session cookie
      fetch(`${BASE_URL}/logout`, { method: 'POST', credentials: 'include' })
        .then(response => response.json())
        .then(data => {
          console.log('Logout response:', data);
          // Clear any client-side storage regardless of backend response for robustness
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userToken'); // If used
          localStorage.removeItem('isUserVerified'); // If used
          updateLoginState(false);
          if(loginEmailInput) loginEmailInput.value = '';
          if(loginPasswordInput) loginPasswordInput.value = '';
          if(signupEmailInput) signupEmailInput.value = '';
          if(signupPasswordInput) signupPasswordInput.value = '';
          if (emailVerificationMessageDiv) emailVerificationMessageDiv.style.display = 'none';
        })
        .catch(error => {
          console.error('Logout fetch error:', error);
          // Still clear client-side storage as a fallback
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userToken'); // If used
          localStorage.removeItem('isUserVerified'); // If used
          updateLoginState(false);
          if(loginEmailInput) loginEmailInput.value = '';
          if(loginPasswordInput) loginPasswordInput.value = '';
          if(signupEmailInput) signupEmailInput.value = '';
          if(signupPasswordInput) signupPasswordInput.value = '';
          if (emailVerificationMessageDiv) emailVerificationMessageDiv.style.display = 'none';
        });
    });
  }

  // Check current user status from backend on page load
  // This will help sync state if session is still active on server
  fetch(`${BASE_URL}/@me`, { credentials: 'include' })
    .then(response => response.json())
    .then(data => {
      if (data.logged_in) {
        localStorage.setItem('userEmail', data.email); // Update/confirm local storage
        // Potentially store name if available: localStorage.setItem('userName', data.name);
        updateLoginState(true, data.email, true); // Assume verified if session active
      } else {
        // Not logged in on backend, ensure client is also logged out
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userToken');
        updateLoginState(false);
      }
    })
    .catch(error => {
      console.error('Error fetching current user status:', error);
      // If backend is unreachable, rely on localStorage for now, or force logout.
      // Forcing logout might be safer if backend state is unknown.
      // updateLoginState(false); // Optionally force logout if backend is down
    });


  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('userEmail');
      // localStorage.removeItem('userToken'); // For future JWT token handling
      // localStorage.removeItem('isUserVerified'); // If we were storing this separately
      updateLoginState(false);
      if(loginEmailInput) loginEmailInput.value = '';
      if(loginPasswordInput) loginPasswordInput.value = '';
      if(signupEmailInput) signupEmailInput.value = '';
      if(signupPasswordInput) signupPasswordInput.value = '';
      if (emailVerificationMessageDiv) emailVerificationMessageDiv.style.display = 'none';
    });
  }

  // Remove or comment out the old resend verification logic as it's not connected to the backend
  // if (emailVerificationMessageDiv) {
  //   emailVerificationMessageDiv.addEventListener('click', (event) => {
  //     if (event.target.id === 'resend-verification-btn') {
  //       console.log('Resend verification email request - (Currently Mocked)');
  //       emailVerificationMessageDiv.innerHTML = 'Verification email resent (mock). Please check your inbox.';
  //       setTimeout(() => {
  //           const currentEmail = localStorage.getItem('userEmail');
  //           // const currentVerified = localStorage.getItem('isUserVerified') === 'true'; // Not used now
  //           if (currentEmail /* && !currentVerified */) { // Simplified condition
  //                emailVerificationMessageDiv.innerHTML = `Please verify your email (${currentEmail}). <button id='resend-verification-btn'>Resend verification</button>`;
  //           } else if (!currentEmail) {
  //               emailVerificationMessageDiv.style.display = 'none';
  //           }
  //       }, 5000);
  //     }
  //   });
  // }
  // --- End Auth Logic ---

  // --- Character Sheet Management Functions ---

  // Function to get all data from the character sheet form
  function getCharacterData() {
    const data = {
      charInfo: {},
      abilityScores: {},
      savingThrows: {},
      combatStats: {},
      skills: {},
      customRolls: [], // Assuming customRolls is an array of objects
      bonuses: []      // Assuming characterBonuses is an array of objects
    };

    // Character Info
    data.charInfo.charName = document.getElementById('charName')?.value || '';
    data.charInfo.charClass = document.getElementById('charClass')?.value || '';
    data.charInfo.charRace = document.getElementById('charRace')?.value || '';
    data.charInfo.charLevel = getIntValue('charLevel');

    // Ability Scores
    abilityScoreConfigs.forEach(config => {
      data.abilityScores[config.scoreId] = getIntValue(config.scoreId);
    });

    // Saving Throws
    saveConfigs.forEach(config => {
      data.savingThrows[config.baseId] = getIntValue(config.baseId);
      data.savingThrows[config.statSelectId] = getSelectedStats(config.statSelectId); // Save selected custom stats
    });

    // Combat Stats - Many fields here
    data.combatStats.hpBase = getIntValue('hpBase');
    data.combatStats.armorBonus = getIntValue('armorBonus');
    data.combatStats.shieldBonus = getIntValue('shieldBonus');
    data.combatStats.sizeModAc = getIntValue('sizeModAc');
    data.combatStats.naturalArmor = getIntValue('naturalArmor');
    data.combatStats.deflectionMod = getIntValue('deflectionMod');
    data.combatStats.miscAcBonus = getIntValue('miscAcBonus');
    data.combatStats.bab = getIntValue('bab');
    data.combatStats.sizeModAttack = getIntValue('sizeModAttack');
    data.combatStats.initiativeMiscMod = getIntValue('initiativeMiscMod');
    // Custom stats for AC, Melee, Ranged
    data.combatStats[defenseConfig.statSelectId] = getSelectedStats(defenseConfig.statSelectId);
    attackConfigs.forEach(config => {
      data.combatStats[config.statSelectId] = getSelectedStats(config.statSelectId);
    });


    // Skills
    skillConfigs.forEach(skill => {
      data.skills[skill.ranksId] = getIntValue(skill.ranksId);
      const checkbox = document.getElementById(skill.classSkillCheckboxId);
      data.skills[skill.classSkillCheckboxId] = checkbox ? checkbox.checked : false;
      data.skills[skill.statSelectId] = getSelectedStats(skill.statSelectId); // Save selected custom stats
    });

    // Custom Rolls and Bonuses (assuming these are stored in global JS variables)
    // Need to ensure `customRolls` and `characterBonuses` are the correct variable names
    // and accessible here. If they are defined locally in DOMContentLoaded, this needs adjustment.
    // For now, assuming they are accessible.
    if (typeof customRolls !== 'undefined') data.customRolls = customRolls; // Defined later in the script
    if (typeof characterBonuses !== 'undefined') data.bonuses = characterBonuses; // Defined at the top

    return data;
  }

  // Function to populate the character sheet form with data
  function populateCharacterData(sheetData) {
    if (!sheetData) return;

    // Character Info
    if (sheetData.charInfo) {
      document.getElementById('charName').value = sheetData.charInfo.charName || '';
      document.getElementById('charClass').value = sheetData.charInfo.charClass || '';
      document.getElementById('charRace').value = sheetData.charInfo.charRace || '';
      document.getElementById('charLevel').value = sheetData.charInfo.charLevel || 1;
    }

    // Ability Scores
    if (sheetData.abilityScores) {
      abilityScoreConfigs.forEach(config => {
        document.getElementById(config.scoreId).value = sheetData.abilityScores[config.scoreId] || 10;
      });
    }

    // Saving Throws
    if (sheetData.savingThrows) {
      saveConfigs.forEach(config => {
        document.getElementById(config.baseId).value = sheetData.savingThrows[config.baseId] || 0;
        // Restore custom stat selections
        const selectedCustomStats = sheetData.savingThrows[config.statSelectId] || [];
        const optionsContainer = document.getElementById(config.statSelectId);
        if (optionsContainer) {
            optionsContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = selectedCustomStats.includes(cb.value);
            });
            updateStatSelectButtonText(config.statSelectBtnId, config.statSelectId, config.defaultStatKey);
        }
      });
    }

    // Combat Stats
    if (sheetData.combatStats) {
      document.getElementById('hpBase').value = sheetData.combatStats.hpBase || 10;
      document.getElementById('armorBonus').value = sheetData.combatStats.armorBonus || 0;
      document.getElementById('shieldBonus').value = sheetData.combatStats.shieldBonus || 0;
      document.getElementById('sizeModAc').value = sheetData.combatStats.sizeModAc || 0;
      document.getElementById('naturalArmor').value = sheetData.combatStats.naturalArmor || 0;
      document.getElementById('deflectionMod').value = sheetData.combatStats.deflectionMod || 0;
      document.getElementById('miscAcBonus').value = sheetData.combatStats.miscAcBonus || 0;
      document.getElementById('bab').value = sheetData.combatStats.bab || 0;
      document.getElementById('sizeModAttack').value = sheetData.combatStats.sizeModAttack || 0;
      document.getElementById('initiativeMiscMod').value = sheetData.combatStats.initiativeMiscMod || 0;

      // Restore custom stats for AC
      const acCustomStats = sheetData.combatStats[defenseConfig.statSelectId] || [];
      const acOptionsContainer = document.getElementById(defenseConfig.statSelectId);
      if (acOptionsContainer) {
          acOptionsContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
              cb.checked = acCustomStats.includes(cb.value);
          });
          updateStatSelectButtonText(defenseConfig.statSelectBtnId, defenseConfig.statSelectId, defenseConfig.defaultStatKey);
      }
      // Restore custom stats for Melee/Ranged Attacks
      attackConfigs.forEach(config => {
        const attackCustomStats = sheetData.combatStats[config.statSelectId] || [];
        const attackOptionsContainer = document.getElementById(config.statSelectId);
        if (attackOptionsContainer) {
            attackOptionsContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = attackCustomStats.includes(cb.value);
            });
            updateStatSelectButtonText(config.statSelectBtnId, config.statSelectId, config.defaultStatKey);
        }
      });
    }

    // Skills
    if (sheetData.skills) {
      skillConfigs.forEach(skill => {
        document.getElementById(skill.ranksId).value = sheetData.skills[skill.ranksId] || 0;
        const checkbox = document.getElementById(skill.classSkillCheckboxId);
        if (checkbox) checkbox.checked = sheetData.skills[skill.classSkillCheckboxId] || false;
        // Restore custom stat selections for skills
        const skillCustomStats = sheetData.skills[skill.statSelectId] || [];
        const skillOptionsContainer = document.getElementById(skill.statSelectId);
        if (skillOptionsContainer) {
            skillOptionsContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = skillCustomStats.includes(cb.value);
            });
            updateStatSelectButtonText(skill.statSelectBtnId, skill.statSelectId, skill.defaultStatKey);
        }
      });
    }

    // Custom Rolls and Bonuses
    // Ensure global `customRolls` and `characterBonuses` are updated
    // These might need to be re-assigned and then their respective render functions called.
    if (sheetData.customRolls) {
      // Assuming customRolls is globally accessible or passed around
      customRolls = sheetData.customRolls; // This was defined later, will need to ensure scope or pass
      if(typeof renderCustomRolls === "function") renderCustomRolls(); // This was defined later
    }
    if (sheetData.bonuses) {
      characterBonuses = sheetData.bonuses; // This is globally defined
      if(typeof renderBonuses === "function") renderBonuses(); // This was defined later
    }

    updateAllCharacterSheetCalculations(); // Recalculate all derived stats
  }

  // Function to render the list of saved character sheets
  function renderSavedSheets() {
    if (!savedSheetsListDiv) return;
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      savedSheetsListDiv.innerHTML = '<p>Please log in to see your saved sheets.</p>';
      return;
    }

    const sheets = JSON.parse(localStorage.getItem(userEmail + '_sheets')) || [];
    savedSheetsListDiv.innerHTML = ''; // Clear current list

    if (sheets.length === 0) {
      savedSheetsListDiv.innerHTML = '<p>No character sheets saved yet.</p>';
      return;
    }

    sheets.forEach(sheet => {
      const sheetItem = document.createElement('div');
      sheetItem.classList.add('saved-sheet-item');
      sheetItem.style.display = 'flex';
      sheetItem.style.justifyContent = 'space-between';
      sheetItem.style.padding = '5px';
      sheetItem.style.borderBottom = '1px solid #eee';

      const sheetNameSpan = document.createElement('span');
      sheetNameSpan.textContent = sheet.name;
      sheetItem.appendChild(sheetNameSpan);

      const buttonsDiv = document.createElement('div');
      const loadBtn = document.createElement('button');
      loadBtn.textContent = 'Load';
      loadBtn.classList.add('load-sheet-btn');
      loadBtn.dataset.sheetName = sheet.name;
      loadBtn.style.marginRight = '5px';
      buttonsDiv.appendChild(loadBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-sheet-btn');
      deleteBtn.dataset.sheetName = sheet.name;
      buttonsDiv.appendChild(deleteBtn);

      sheetItem.appendChild(buttonsDiv);
      savedSheetsListDiv.appendChild(sheetItem);
    });
  }

  // --- Event Listeners for Character Sheet Management ---
  if (saveSheetButton) {
    saveSheetButton.addEventListener('click', () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('You must be logged in to save a character sheet.');
        return;
      }
      let characterName = sheetNameInput.value.trim();
      if (!characterName) {
        // Use character's name from charInfo if sheet name input is blank
        characterName = document.getElementById('charName')?.value.trim();
        if (!characterName) {
            characterName = "Unnamed Character"; // Default if both are blank
        }
        sheetNameInput.value = characterName; // Update input field
      }

      const sheetData = getCharacterData();
      const newSheet = { name: characterName, data: sheetData, lastModified: new Date().toISOString() };

      let sheets = JSON.parse(localStorage.getItem(userEmail + '_sheets')) || [];
      // Check if sheet with this name already exists, if so, replace it (simple update)
      const existingSheetIndex = sheets.findIndex(s => s.name === characterName);
      if (existingSheetIndex > -1) {
        sheets[existingSheetIndex] = newSheet;
      } else {
        sheets.push(newSheet);
      }
      localStorage.setItem(userEmail + '_sheets', JSON.stringify(sheets));
      renderSavedSheets();
      alert(`Character sheet "${characterName}" saved!`);
    });
  }

  if (loadSheetButton) { // This is the "Refresh Saved Sheets" button
    loadSheetButton.addEventListener('click', () => {
      renderSavedSheets(); // Simply re-render the list from localStorage
    });
  }

  if (savedSheetsListDiv) {
    savedSheetsListDiv.addEventListener('click', (event) => {
      const target = event.target;
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return; // Should not happen if list is visible

      let sheets = JSON.parse(localStorage.getItem(userEmail + '_sheets')) || [];
      const sheetName = target.dataset.sheetName;

      if (target.classList.contains('load-sheet-btn')) {
        const sheetToLoad = sheets.find(s => s.name === sheetName);
        if (sheetToLoad) {
          populateCharacterData(sheetToLoad.data);
          if(sheetNameInput) sheetNameInput.value = sheetName; // Populate the sheet name input field
          alert(`Character sheet "${sheetName}" loaded!`);
        } else {
          alert('Error: Could not find sheet to load.');
        }
      } else if (target.classList.contains('delete-sheet-btn')) {
        if (confirm(`Are you sure you want to delete "${sheetName}"?`)) {
          sheets = sheets.filter(s => s.name !== sheetName);
          localStorage.setItem(userEmail + '_sheets', JSON.stringify(sheets));
          renderSavedSheets();
          alert(`Character sheet "${sheetName}" deleted.`);
        }
      }
    });
  }

  // --- End Character Sheet Management ---


  initializeCustomDropdowns(); // Initialize new dropdowns

  const rollResultModal = document.getElementById('rollResultModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalResultText = document.getElementById('modalResultText');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const webhookUrlInput = document.getElementById('webhookUrlInput');
  const saveWebhookBtn = document.getElementById('saveWebhookBtn');
  const webhookStatusMessage = document.getElementById('webhookStatusMessage');
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') { document.body.classList.add('dark-mode'); }
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  }

  abilityScoreConfigs.forEach(ability => {
    const scoreInput = document.getElementById(ability.scoreId);
    if (scoreInput) {
      scoreInput.addEventListener('input', updateAllCharacterSheetCalculations);
    }
  });

  skillConfigs.forEach((skill) => {
    const ranksInput = document.getElementById(skill.ranksId);
    if (ranksInput) {
      ranksInput.addEventListener('input', updateAllCharacterSheetCalculations);
    }
    const classSkillCheckbox = document.getElementById(skill.classSkillCheckboxId);
    if (classSkillCheckbox) {
      classSkillCheckbox.addEventListener('change', updateAllCharacterSheetCalculations);
    }
    // Removed old statSelect listeners, new ones are in initializeCustomDropdowns
  });
  
  const inputIdsToTriggerFullRecalc = [
    'hpBase', 'armorBonus', 'shieldBonus', 'sizeModAc', 'naturalArmor', 
    'deflectionMod', 'miscAcBonus', 'bab', 'sizeModAttack', 'initiativeMiscMod',
    'fortBase', 'refBase', 'willBase'
  ];
  inputIdsToTriggerFullRecalc.forEach(inputId => {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.addEventListener('input', updateAllCharacterSheetCalculations);
    }
  });

  // Removed old statSelect listeners for saves, attack, ac - handled by initializeCustomDropdowns

  console.assert(calculateAbilityModifier(10) === 0, "Test Failed: Modifier for 10 should be 0");
  console.assert(calculateAbilityModifier(12) === 1, "Test Failed: Modifier for 12 should be 1");

function rollDice(diceNotationInput) {
  let total = 0;
  let rollsDescription = "Rolls: ";
  const individualRolls = [];
  let modifierSum = 0;
  const storedDiceNotation = diceNotationInput;
  let normalizedNotation = diceNotationInput.trim();
  if (normalizedNotation.startsWith('d')) { normalizedNotation = '1' + normalizedNotation; }
  const errorReturn = (message) => ({ total: NaN, rollsDescription: message, individualRolls: [], modifier: 0, diceNotation: storedDiceNotation });
  const terms = normalizedNotation.match(/[+\-]?[^+\-]+/g) || [];
  for (let i = 0; i < terms.length; i++) {
    let term = terms[i];
    let isNegative = term.startsWith('-');
    let termValueStr = term.replace(/^[+\-]/, '');
    if (i === 0 && !term.startsWith('+') && !term.startsWith('-')) { isNegative = false; }
    if (termValueStr.includes('d')) {
      let [numDiceStr, numSidesStr] = termValueStr.split('d');
      let numDice = numDiceStr === '' ? 1 : parseInt(numDiceStr, 10);
      let numSides = parseInt(numSidesStr, 10);
      if (isNaN(numDice) || numDice <= 0) return errorReturn(`Error: Invalid number of dice '${numDiceStr}' in term '${term}'`);
      if (isNaN(numSides) || numSides <= 0) return errorReturn(`Error: Invalid number of sides '${numSidesStr}' in term '${term}'`);
      for (let j = 0; j < numDice; j++) {
        const roll = Math.floor(Math.random() * numSides) + 1;
        individualRolls.push(roll);
        if (isNegative) total -= roll; else total += roll;
      }
    } else {
      const modifierVal = parseInt(termValueStr, 10);
      if (isNaN(modifierVal)) return errorReturn(`Error: Invalid modifier '${termValueStr}' in term '${term}'`);
      if (isNegative) { total -= modifierVal; modifierSum -= modifierVal; }
      else { total += modifierVal; modifierSum += modifierVal; }
    }
  }
  rollsDescription += individualRolls.length > 0 ? individualRolls.join(', ') : "None";
  if (modifierSum !== 0 || (terms.some(term => !term.includes('d')) && individualRolls.length > 0) || terms.length === 0 && modifierSum !==0 ) {
    rollsDescription += `. Modifier: ${modifierSum >= 0 ? '+' : ''}${modifierSum}`;
  }
  rollsDescription += `. Total: ${total}`;
  return { total: total, rollsDescription: rollsDescription, individualRolls: individualRolls, modifier: modifierSum, diceNotation: storedDiceNotation };
}

  const addCustomRollBtn = document.getElementById('addCustomRollBtn');
  const customRollFormContainer = document.getElementById('customRollFormContainer');
  const customRollsDisplayContainer = document.getElementById('customRollsDisplayContainer');
  let customRolls = [];
  function createNewRollForm() { /* ... existing code ... */ }
  function renderCustomRolls() { /* ... existing code ... */ }
  if (addCustomRollBtn) addCustomRollBtn.addEventListener('click', createNewRollForm);
  renderCustomRolls();

  const addBonusBtn = document.getElementById('addBonusBtn');
  const bonusFormContainer = document.getElementById('bonusFormContainer');
  const bonusesDisplayContainer = document.getElementById('bonusesDisplayContainer');
  if (addBonusBtn) addBonusBtn.addEventListener('click', createNewBonusForm);
  if (bonusesDisplayContainer) { /* ... existing code ... */ }
  renderBonuses();

  function showModal(title, resultContent) { /* ... existing code ... */ }
  function hideModal() { /* ... existing code ... */ }
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
  if (rollResultModal) rollResultModal.addEventListener('click', (event) => { if (event.target === rollResultModal) hideModal(); });

  document.querySelectorAll('.roll-skill-btn').forEach(button => { /* ... existing code ... */ });
  document.querySelectorAll('.roll-stat-btn').forEach(button => { /* ... existing code ... */ });
  document.querySelectorAll('.roll-save-btn').forEach(button => { /* ... existing code ... */ });

  // Re-add existing function implementations that were truncated in the prompt
  // For createNewRollForm, renderCustomRolls, createNewBonusForm, renderBonuses, showModal, hideModal and roll button listeners
  // This is a placeholder comment; actual tool would re-insert the full functions.
  // For brevity, I will only show the parts that were fully defined or needed changes for this task.
  // The tool should be able to reconstruct the full file by taking the old version and applying the new logic.
  // The following are placeholders for the functions that were not fully shown in the diff but are part of the original file.

  if (addCustomRollBtn) addCustomRollBtn.addEventListener('click', createNewRollForm);
  renderCustomRolls();
  if (addBonusBtn) addBonusBtn.addEventListener('click', createNewBonusForm);
  renderBonuses();
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
  if (rollResultModal) rollResultModal.addEventListener('click', (event) => { if (event.target === rollResultModal) hideModal(); });
  document.querySelectorAll('.roll-skill-btn').forEach(button => {
    button.addEventListener('click', function() {
      const skillName = this.dataset.skillname;
      const totalId = this.dataset.totalid;
      const skillTotal = getIntValue(totalId);
      const result = rollDice(`1d20+${skillTotal}`);
      showModal(`${skillName} Roll`, result.rollsDescription);
      const characterName = document.getElementById('charName')?.value.trim() || "Unnamed Character";
      sendToWebhook({
        username: `${characterName} (Pathfinder Sheet)`,
        embeds: [{ title: `Skill Roll: ${skillName}`, description: `**${result.total}**\n*${result.rollsDescription}*`, color: 5814783, timestamp: new Date().toISOString(), author: { name: characterName } }],
      });
    });
  });
  document.querySelectorAll('.roll-stat-btn').forEach(button => {
    button.addEventListener('click', function() {
      const statName = this.dataset.statname;
      const modId = this.dataset.modid;
      const statMod = getAbilityModifierValue(modId);
      const result = rollDice(`1d20+${statMod}`);
      showModal(`${statName} Check`, result.rollsDescription);
      const characterName = document.getElementById('charName')?.value.trim() || "Unnamed Character";
      sendToWebhook({
        username: `${characterName} (Pathfinder Sheet)`,
        embeds: [{ title: `Stat Check: ${statName}`, description: `**${result.total}**\n*${result.rollsDescription}*`, color: 5814783, timestamp: new Date().toISOString(), author: { name: characterName } }],
      });
    });
  });
  document.querySelectorAll('.roll-save-btn').forEach(button => {
    button.addEventListener('click', function() {
      const saveName = this.dataset.savename;
      const totalId = this.dataset.totalid;
      const saveTotal = getIntValue(totalId);
      const result = rollDice(`1d20+${saveTotal}`);
      showModal(`${saveName} Save Roll`, result.rollsDescription);
      const characterName = document.getElementById('charName')?.value.trim() || "Unnamed Character";
      sendToWebhook({
        username: `${characterName} (Pathfinder Sheet)`,
        embeds: [{
          author: { name: characterName },
          title: `Save Roll: ${saveName}`,
          description: `**${result.total}**\n*${result.rollsDescription}*`,
          color: 5814783,
          timestamp: new Date().toISOString(),
        }],
      });
    });
  });

  if (webhookUrlInput) {
    const savedWebhookUrl = localStorage.getItem('webhookUrl');
    if (savedWebhookUrl) webhookUrlInput.value = savedWebhookUrl;
  }
  if (saveWebhookBtn && webhookUrlInput && webhookStatusMessage) {
    saveWebhookBtn.addEventListener('click', () => {
      localStorage.setItem('webhookUrl', webhookUrlInput.value.trim());
      webhookStatusMessage.textContent = 'Webhook URL saved!';
      setTimeout(() => { webhookStatusMessage.textContent = ''; }, 3000);
    });
  }

  updateAllCharacterSheetCalculations();
}); // End DOMContentLoaded

// Full function definitions for brevity in prompt, assuming they exist from previous steps
function createNewRollForm() {
    if (!document.getElementById('customRollFormContainer')) { console.error('customRollFormContainer not found'); return; }
    if (document.getElementById('customRollFormContainer').querySelector('.custom-roll-form')) {
        alert("A custom roll form is already open."); return;
    }
    const formDiv = document.createElement('div');
    formDiv.classList.add('custom-roll-form');
    let formHTML = `<div><label for="rollDescription_temp">Description:</label><input type="text" class="roll-description-input" name="rollDescription_temp" placeholder="e.g., Longsword Damage"></div><div><label>Dice (enter quantity):</label></div><div style="display: flex; flex-wrap: wrap;">`;
    const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
    diceTypes.forEach(die => {
        formHTML += `<div style="margin-right: 10px; margin-bottom: 5px; display: flex; align-items: center;"><label class="dice-label" for="${die}_count_temp" style="min-width: auto; margin-right: 3px;">${die}:</label><input type="number" class="dice-input" data-die="${die}" name="${die}_count_temp" value="0" min="0" style="width: 45px;"></div>`;
    });
    formHTML += `</div><div style="margin-top: 10px;"><button class="save-roll-btn">Save Roll</button><button class="cancel-roll-btn" type="button" style="margin-left: 10px;">Cancel</button></div>`;
    formDiv.innerHTML = formHTML;
    document.getElementById('customRollFormContainer').appendChild(formDiv);

    formDiv.querySelector('.save-roll-btn').addEventListener('click', function(event) {
        event.preventDefault();
        const description = formDiv.querySelector('.roll-description-input').value.trim();
        const diceCounts = [];
        formDiv.querySelectorAll('.dice-input').forEach(input => {
            const count = parseInt(input.value, 10);
            if (count > 0) diceCounts.push({ die: input.dataset.die, count: count });
        });
        if (description === '' && diceCounts.length === 0) { alert("Please enter a description or at least one die."); return; }
        if (diceCounts.length === 0) { alert("Please specify at least one die."); return; }
        customRolls.push({ id: Date.now().toString(), description: description || "Custom Roll", dice: diceCounts });
        renderCustomRolls();
        formDiv.remove();
    });
    formDiv.querySelector('.cancel-roll-btn').addEventListener('click', () => formDiv.remove());
}

function renderCustomRolls() {
  const customRollsDisplayContainer = document.getElementById('customRollsDisplayContainer');
  if (!customRollsDisplayContainer) { console.error('customRollsDisplayContainer not found'); return; }
  customRollsDisplayContainer.innerHTML = '';
  customRolls.forEach(roll => {
      const rollDiv = document.createElement('div');
      rollDiv.classList.add('displayed-roll');
      rollDiv.dataset.rollId = roll.id;
      const descriptionSpan = document.createElement('span');
      descriptionSpan.textContent = roll.description;
      const diceSummarySpan = document.createElement('span');
      diceSummarySpan.textContent = roll.dice.map(d => `${d.count}${d.die}`).join(' + ');
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
          customRolls = customRolls.filter(r => r.id !== roll.id);
          renderCustomRolls();
      });
      const rollActionBtn = document.createElement('button');
      rollActionBtn.textContent = 'Roll';
      rollActionBtn.classList.add('roll-custom-btn');
      rollActionBtn.addEventListener('click', () => {
        let diceNotation = roll.dice.map(d => `${d.count}${d.die}`).join('+');
        if (!diceNotation) { showModal(`${roll.description} Roll Error`, "No dice specified."); return; }
        const result = rollDice(diceNotation);
        showModal(`${roll.description} Roll`, result.rollsDescription);
        const characterName = document.getElementById('charName')?.value.trim() || "Unnamed Character";
        sendToWebhook({
          username: `${characterName} (Pathfinder Sheet)`,
          embeds: [{ title: `Custom Roll: ${roll.description || 'Unnamed'}`, description: `**${result.total}**\n*${result.rollsDescription}*`, color: 5814783, timestamp: new Date().toISOString(), author: { name: characterName } }],
        });
      });
      rollDiv.appendChild(descriptionSpan);
      rollDiv.appendChild(diceSummarySpan);
      rollDiv.appendChild(rollActionBtn);
      rollDiv.appendChild(deleteBtn);
      customRollsDisplayContainer.appendChild(rollDiv);
  });
}

function createNewBonusForm() {
  const bonusFormContainerRef = document.getElementById('bonusFormContainer');
  if (!bonusFormContainerRef) { console.error('bonusFormContainer not found.'); return; }
  if (bonusFormContainerRef.querySelector('.bonus-form')) { alert('A bonus form is already open.'); return; }

  const formDiv = document.createElement('div');
  formDiv.classList.add('bonus-form');
  // Start of formHTML modification
  let formHTML = `
    <div><label for="bonusTypeSelect_temp">Bonus Type:</label><select id="bonusTypeSelect_temp" name="bonusTypeSelect_temp"><option value="">-- Select Type --</option>${bonusTypes.map(type => `<option value="${type}">${type}</option>`).join('')}</select></div>
    <div><label for="bonusValue_temp">Bonus Value:</label><input type="number" id="bonusValue_temp" name="bonusValue_temp" value="0"></div>

    <div>
      <label for="bonusAppliesToBtn_temp">Applies To:</label>
      <button type="button" id="bonusAppliesToBtn_temp" class="stat-select-button">Select Targets</button>
    </div>
    <div id="bonusAppliesToOptions_temp" class="stat-select-dropdown-options" style="display: none;">`; // Removed width: 100%;

  bonusApplicationTargets.forEach(target => {
    const checkboxId = `bonusTarget_${target.replace(/\s+/g, '').replace(/[()]/g, '')}_temp`;
    formHTML += `
      <label style="display: block; padding: 4px 8px; cursor: pointer;">
          <input type="checkbox" id="${checkboxId}" name="bonusTarget_temp" value="${target}" style="margin-right: 8px; vertical-align: middle;">
          ${target}
      </label>`;
  });
  formHTML += `</div>`; // Close bonusAppliesToOptions_temp

  formHTML += `
    <div><label for="bonusDescription_temp">Description/Notes:</label><textarea id="bonusDescription_temp" name="bonusDescription_temp" placeholder="e.g., +2 insight to Perception"></textarea></div>
    <div style="margin-top: 10px;"><button class="save-bonus-btn">Save Bonus</button><button type="button" class="cancel-bonus-btn">Cancel</button></div>`;
  // End of formHTML modification
  formDiv.innerHTML = formHTML;
  bonusFormContainerRef.appendChild(formDiv);

  // --- Logic for the new "Applies To" custom dropdown ---
  const appliesToBtn = formDiv.querySelector('#bonusAppliesToBtn_temp');
  const appliesToOptionsDiv = formDiv.querySelector('#bonusAppliesToOptions_temp');

  if (appliesToBtn && appliesToOptionsDiv) {
      const appliesToCheckboxes = appliesToOptionsDiv.querySelectorAll('input[name="bonusTarget_temp"]');
      // Initialize button text
      updateBonusAppliesToButtonText(appliesToBtn, appliesToOptionsDiv);

      appliesToBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          const isHidden = appliesToOptionsDiv.style.display === 'none';
          // Close other custom dropdowns on the page if any were managed by a similar system
          // For this specific form, we assume it's the only one of its kind active,
          // or that its lifecycle is managed by the form's visibility.
          appliesToOptionsDiv.style.display = isHidden ? 'block' : 'none';
      });

      appliesToCheckboxes.forEach(checkbox => {
          checkbox.addEventListener('change', () => {
              updateBonusAppliesToButtonText(appliesToBtn, appliesToOptionsDiv);
          });
      });

      // Click-outside-to-close listener specifically for this dropdown
      // Wrapped in a named function to potentially manage removal, though complex in this structure
      const closeAppliesToDropdownListener = (event) => {
          if (appliesToOptionsDiv.style.display === 'block' &&
              !appliesToBtn.contains(event.target) &&
              !appliesToOptionsDiv.contains(event.target)) {
              appliesToOptionsDiv.style.display = 'none';
          }
      };
      // Add this listener with capture to ensure it can act before other potential stopPropagation calls.
      // It's added to the document and will be active as long as the formDiv exists.
      // When formDiv is removed (on save/cancel), this listener ideally should be cleaned up
      // if it were attached to formDiv. Since it's on document, it's more complex.
      // A simpler approach might be to rely on the form's modal nature or handle within form's main event flow.
      // For now, let's keep it simple. If this becomes an issue, a more robust cleanup is needed.
      document.addEventListener('click', closeAppliesToDropdownListener, true);

      // Attempt to remove the listener when the form is removed.
      const originalRemove = formDiv.remove;
      formDiv.remove = function() {
          document.removeEventListener('click', closeAppliesToDropdownListener, true);
          originalRemove.apply(this, arguments);
      };
  }

  formDiv.querySelector('.save-bonus-btn').addEventListener('click', () => {
    const selectedType = formDiv.querySelector('#bonusTypeSelect_temp').value;
    const bonusValue = parseInt(formDiv.querySelector('#bonusValue_temp').value, 10) || 0;
    const descriptionText = formDiv.querySelector('#bonusDescription_temp').value;
    const selectedTargets = Array.from(formDiv.querySelectorAll('input[name="bonusTarget_temp"]:checked')).map(cb => cb.value);
    if (!selectedType) { alert("Please select a bonus type."); return; }
    if (selectedTargets.length === 0) { alert("Please select at least one target."); return; }
    characterBonuses.push({ id: Date.now().toString(), type: selectedType, appliesTo: selectedTargets, value: bonusValue, description: descriptionText.trim() });
    renderBonuses();
    updateAllCharacterSheetCalculations();
    formDiv.remove();
  });
  formDiv.querySelector('.cancel-bonus-btn').addEventListener('click', () => formDiv.remove());
}

function updateBonusAppliesToButtonText(buttonElement, optionsContainerElement) {
    if (!buttonElement || !optionsContainerElement) return;

    const checkedCheckboxes = Array.from(optionsContainerElement.querySelectorAll('input[type="checkbox"]:checked'));
    const selectedTargets = checkedCheckboxes.map(cb => cb.value);

    if (selectedTargets.length === 0) {
        buttonElement.textContent = 'Select Targets';
    } else if (selectedTargets.length <= 2) {
        buttonElement.textContent = selectedTargets.join(', ');
    } else {
        buttonElement.textContent = `${selectedTargets.length} Targets Selected`;
    }
}

function renderBonuses() {
  const displayContainer = document.getElementById('bonusesDisplayContainer');
  if (!displayContainer) { console.error('bonusesDisplayContainer not found.'); return; }
  displayContainer.innerHTML = '';
  characterBonuses.forEach(bonus => {
    const bonusDiv = document.createElement('div');
    bonusDiv.classList.add('displayed-bonus');
    bonusDiv.dataset.bonusId = bonus.id;
    const summaryP = document.createElement('p');
    summaryP.textContent = `Type: ${bonus.type} (${bonus.value >= 0 ? '+' : ''}${bonus.value})`;
    const appliesToP = document.createElement('p');
    appliesToP.textContent = `Applies to: ${bonus.appliesTo.join(', ')}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-bonus-btn');
    deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() { // Added event listener for delete here
        characterBonuses = characterBonuses.filter(b => b.id !== bonus.id);
        renderBonuses();
        updateAllCharacterSheetCalculations();
    });
    bonusDiv.appendChild(deleteBtn);
    bonusDiv.appendChild(summaryP);
    bonusDiv.appendChild(appliesToP);
    if (bonus.description) {
      const descriptionP = document.createElement('p');
      descriptionP.textContent = bonus.description;
      bonusDiv.appendChild(descriptionP);
    }
    displayContainer.appendChild(bonusDiv);
  });
}

function showModal(title, resultContent) {
    const modalTitleEl = document.getElementById('modalTitle');
    const modalResultTextEl = document.getElementById('modalResultText');
    const rollResultModalEl = document.getElementById('rollResultModal');
    if (modalTitleEl && modalResultTextEl && rollResultModalEl) {
      modalTitleEl.textContent = title;
      modalResultTextEl.innerHTML = resultContent; // Use innerHTML for potentially formatted dice rolls
      rollResultModalEl.classList.remove('modal-hidden');
      rollResultModalEl.classList.add('modal-visible');
    }
}

function hideModal() {
    const rollResultModalEl = document.getElementById('rollResultModal');
    if (rollResultModalEl) {
      rollResultModalEl.classList.remove('modal-visible');
      rollResultModalEl.classList.add('modal-hidden');
    }
}
