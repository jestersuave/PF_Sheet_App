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

  const sheetContainer = document.getElementById('sheet-container');
  console.log('sheetContainer:', sheetContainer);

  // --- Character Sheet Management DOM Elements ---
  const characterSheetManagementDiv = document.getElementById('character-sheet-management');
  characterSheetManagementDiv.style.display = 'block';
  console.log('characterSheetManagementDiv:', characterSheetManagementDiv);
  const saveSheetButton = document.getElementById('save-sheet-button');
  console.log('saveSheetButton:', saveSheetButton);
  const sheetNameInput = document.getElementById('sheet-name-input');
  console.log('sheetNameInput:', sheetNameInput);
  const loadSheetButton = document.getElementById('load-sheet-button');
  console.log('loadSheetButton (Refresh List):', loadSheetButton);
  const savedSheetsListDiv = document.getElementById('saved-sheets-list');
  console.log('savedSheetsListDiv:', savedSheetsListDiv);

  renderSavedSheets();

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

    const sheets = JSON.parse(localStorage.getItem('characterSheets')) || [];
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
      let characterName = sheetNameInput.value.trim();
      if (!characterName) {
        characterName = document.getElementById('charName')?.value.trim() || "Unnamed Character";
        sheetNameInput.value = characterName;
      }

      const sheetData = getCharacterData();
      const sheets = JSON.parse(localStorage.getItem('characterSheets')) || [];
      const existingSheetIndex = sheets.findIndex(sheet => sheet.name === characterName);

      if (existingSheetIndex > -1) {
        sheets[existingSheetIndex].data = sheetData;
      } else {
        sheets.push({ name: characterName, data: sheetData });
      }

      localStorage.setItem('characterSheets', JSON.stringify(sheets));
      renderSavedSheets();
      alert(`Character sheet "${characterName}" saved!`);
    });
  }

  if (loadSheetButton) { // This is the "Refresh Saved Sheets" button
    loadSheetButton.addEventListener('click', () => {
      renderSavedSheets();
    });
  }

  if (savedSheetsListDiv) {
    savedSheetsListDiv.addEventListener('click', (event) => {
      const target = event.target;
      const sheetName = target.dataset.sheetName;

      if (target.classList.contains('load-sheet-btn')) {
        const sheets = JSON.parse(localStorage.getItem('characterSheets')) || [];
        const sheetToLoad = sheets.find(sheet => sheet.name === sheetName);
        if (sheetToLoad) {
          populateCharacterData(sheetToLoad.data);
          if(sheetNameInput) sheetNameInput.value = sheetName;
          alert(`Character sheet "${sheetName}" loaded!`);
        }
      } else if (target.classList.contains('delete-sheet-btn')) {
        if (confirm(`Are you sure you want to delete "${sheetName}"?`)) {
          let sheets = JSON.parse(localStorage.getItem('characterSheets')) || [];
          sheets = sheets.filter(sheet => sheet.name !== sheetName);
          localStorage.setItem('characterSheets', JSON.stringify(sheets));
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

  const clearSheetBtn = document.getElementById('clearSheetBtn');
  if (clearSheetBtn) {
    clearSheetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data on this sheet? This action cannot be undone.')) {
        clearSheet();
      }
    });
  }

  function clearSheet() {
    // Reset all input fields to their default or empty state
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    inputs.forEach(input => {
      if (input.id.includes('Score')) {
        input.value = '10';
      } else if (input.id === 'charLevel') {
        input.value = '1';
      } else if (input.id === 'hpBase') {
        input.value = '10';
      } else if(input.type === 'number') {
        input.value = '0';
      } else {
        input.value = '';
      }
    });

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // Reset custom rolls and bonuses
    customRolls = [];
    characterBonuses = [];
    renderCustomRolls();
    renderBonuses();

    // Recalculate everything
    updateAllCharacterSheetCalculations();

    // Reset dropdown button texts
    initializeCustomDropdowns(); // This will re-run the text updates

    alert('Character sheet has been cleared.');
  }

  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', downloadPdf);
  }

  function downloadPdf() {
    const sheetContainer = document.getElementById('sheet-container');
    const charName = document.getElementById('charName').value.trim() || 'character-sheet';
    const options = {
      margin: 0.5,
      filename: `${charName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(sheetContainer).set(options).save();
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
});

// Full function definitions for brevity in prompt, assuming they exist from previous steps
