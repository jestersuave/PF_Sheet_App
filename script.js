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
  // console.warn(`Element ${elementId} not found, defaulting to 0.`); // Keep this commented unless debugging specific issues
  return 0;
}

// Helper to get selected values from a multi-select dropdown
function getSelectedStats(selectElementId) {
  const selectElement = document.getElementById(selectElementId);
  if (!selectElement) return [];
  return Array.from(selectElement.selectedOptions).map(option => option.value);
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

function updateAbilityModifierDisplay(scoreId, modId) {
  const scoreInput = document.getElementById(scoreId);
  const modSpan = document.getElementById(modId);

  if (scoreInput && modSpan) {
    const score = parseInt(scoreInput.value, 10);
    let modifier = 0;
    if (!isNaN(score)) {
      modifier = calculateAbilityModifier(score);
    }
    modSpan.textContent = modifier;
  } else {
    console.error(`Elements not found for ability score: ${scoreId} or ${modId}`);
  }
}

// --- Skills ---
const skillConfigs = [
  // Updated to include statSelectId and defaultStat (derived from abilityModId)
  { ranksId: 'acrobaticsRanks', abilityModId: 'dexMod', totalId: 'acrobaticsTotal', classSkillCheckboxId: 'acrobaticsClassSkillChk', classSkillTextId: 'acrobaticsClassSkillText', statSelectId: 'acrobaticsStatSelect' },
  { ranksId: 'appraiseRanks', abilityModId: 'intMod', totalId: 'appraiseTotal', classSkillCheckboxId: 'appraiseClassSkillChk', classSkillTextId: 'appraiseClassSkillText', statSelectId: 'appraiseStatSelect' },
  { ranksId: 'bluffRanks', abilityModId: 'chaMod', totalId: 'bluffTotal', classSkillCheckboxId: 'bluffClassSkillChk', classSkillTextId: 'bluffClassSkillText', statSelectId: 'bluffStatSelect' },
  { ranksId: 'climbRanks', abilityModId: 'strMod', totalId: 'climbTotal', classSkillCheckboxId: 'climbClassSkillChk', classSkillTextId: 'climbClassSkillText', statSelectId: 'climbStatSelect' },
  { ranksId: 'craftRanks', abilityModId: 'intMod', totalId: 'craftTotal', classSkillCheckboxId: 'craftClassSkillChk', classSkillTextId: 'craftClassSkillText', statSelectId: 'craftStatSelect' },
  { ranksId: 'diplomacyRanks', abilityModId: 'chaMod', totalId: 'diplomacyTotal', classSkillCheckboxId: 'diplomacyClassSkillChk', classSkillTextId: 'diplomacyClassSkillText', statSelectId: 'diplomacyStatSelect' },
  { ranksId: 'disableDeviceRanks', abilityModId: 'dexMod', totalId: 'disableDeviceTotal', classSkillCheckboxId: 'disableDeviceClassSkillChk', classSkillTextId: 'disableDeviceClassSkillText', statSelectId: 'disableDeviceStatSelect' },
  { ranksId: 'disguiseRanks', abilityModId: 'chaMod', totalId: 'disguiseTotal', classSkillCheckboxId: 'disguiseClassSkillChk', classSkillTextId: 'disguiseClassSkillText', statSelectId: 'disguiseStatSelect' },
  { ranksId: 'escapeArtistRanks', abilityModId: 'dexMod', totalId: 'escapeArtistTotal', classSkillCheckboxId: 'escapeArtistClassSkillChk', classSkillTextId: 'escapeArtistClassSkillText', statSelectId: 'escapeArtistStatSelect' },
  { ranksId: 'flyRanks', abilityModId: 'dexMod', totalId: 'flyTotal', classSkillCheckboxId: 'flyClassSkillChk', classSkillTextId: 'flyClassSkillText', statSelectId: 'flyStatSelect' },
  { ranksId: 'handleAnimalRanks', abilityModId: 'chaMod', totalId: 'handleAnimalTotal', classSkillCheckboxId: 'handleAnimalClassSkillChk', classSkillTextId: 'handleAnimalClassSkillText', statSelectId: 'handleAnimalStatSelect' },
  { ranksId: 'healRanks', abilityModId: 'wisMod', totalId: 'healTotal', classSkillCheckboxId: 'healClassSkillChk', classSkillTextId: 'healClassSkillText', statSelectId: 'healStatSelect' },
  { ranksId: 'intimidateRanks', abilityModId: 'chaMod', totalId: 'intimidateTotal', classSkillCheckboxId: 'intimidateClassSkillChk', classSkillTextId: 'intimidateClassSkillText', statSelectId: 'intimidateStatSelect' },
  { ranksId: 'knowledgeArcanaRanks', abilityModId: 'intMod', totalId: 'knowledgeArcanaTotal', classSkillCheckboxId: 'knowledgeArcanaClassSkillChk', classSkillTextId: 'knowledgeArcanaClassSkillText', statSelectId: 'knowledgeArcanaStatSelect' },
  { ranksId: 'knowledgeDungeoneeringRanks', abilityModId: 'intMod', totalId: 'knowledgeDungeoneeringTotal', classSkillCheckboxId: 'knowledgeDungeoneeringClassSkillChk', classSkillTextId: 'knowledgeDungeoneeringClassSkillText', statSelectId: 'knowledgeDungeoneeringStatSelect' },
  { ranksId: 'knowledgeEngineeringRanks', abilityModId: 'intMod', totalId: 'knowledgeEngineeringTotal', classSkillCheckboxId: 'knowledgeEngineeringClassSkillChk', classSkillTextId: 'knowledgeEngineeringClassSkillText', statSelectId: 'knowledgeEngineeringStatSelect' },
  { ranksId: 'knowledgeGeographyRanks', abilityModId: 'intMod', totalId: 'knowledgeGeographyTotal', classSkillCheckboxId: 'knowledgeGeographyClassSkillChk', classSkillTextId: 'knowledgeGeographyClassSkillText', statSelectId: 'knowledgeGeographyStatSelect' },
  { ranksId: 'knowledgeHistoryRanks', abilityModId: 'intMod', totalId: 'knowledgeHistoryTotal', classSkillCheckboxId: 'knowledgeHistoryClassSkillChk', classSkillTextId: 'knowledgeHistoryClassSkillText', statSelectId: 'knowledgeHistoryStatSelect' },
  { ranksId: 'knowledgeLocalRanks', abilityModId: 'intMod', totalId: 'knowledgeLocalTotal', classSkillCheckboxId: 'knowledgeLocalClassSkillChk', classSkillTextId: 'knowledgeLocalClassSkillText', statSelectId: 'knowledgeLocalStatSelect' },
  { ranksId: 'knowledgeNatureRanks', abilityModId: 'intMod', totalId: 'knowledgeNatureTotal', classSkillCheckboxId: 'knowledgeNatureClassSkillChk', classSkillTextId: 'knowledgeNatureClassSkillText', statSelectId: 'knowledgeNatureStatSelect' },
  { ranksId: 'knowledgeNobilityRanks', abilityModId: 'intMod', totalId: 'knowledgeNobilityTotal', classSkillCheckboxId: 'knowledgeNobilityClassSkillChk', classSkillTextId: 'knowledgeNobilityClassSkillText', statSelectId: 'knowledgeNobilityStatSelect' },
  { ranksId: 'knowledgePlanesRanks', abilityModId: 'intMod', totalId: 'knowledgePlanesTotal', classSkillCheckboxId: 'knowledgePlanesClassSkillChk', classSkillTextId: 'knowledgePlanesClassSkillText', statSelectId: 'knowledgePlanesStatSelect' },
  { ranksId: 'knowledgeReligionRanks', abilityModId: 'intMod', totalId: 'knowledgeReligionTotal', classSkillCheckboxId: 'knowledgeReligionClassSkillChk', classSkillTextId: 'knowledgeReligionClassSkillText', statSelectId: 'knowledgeReligionStatSelect' },
  { ranksId: 'linguisticsRanks', abilityModId: 'intMod', totalId: 'linguisticsTotal', classSkillCheckboxId: 'linguisticsClassSkillChk', classSkillTextId: 'linguisticsClassSkillText', statSelectId: 'linguisticsStatSelect' },
  { ranksId: 'perceptionRanks', abilityModId: 'wisMod', totalId: 'perceptionTotal', classSkillCheckboxId: 'perceptionClassSkillChk', classSkillTextId: 'perceptionClassSkillText', statSelectId: 'perceptionStatSelect' },
  { ranksId: 'performRanks', abilityModId: 'chaMod', totalId: 'performTotal', classSkillCheckboxId: 'performClassSkillChk', classSkillTextId: 'performClassSkillText', statSelectId: 'performStatSelect' },
  { ranksId: 'professionRanks', abilityModId: 'wisMod', totalId: 'professionTotal', classSkillCheckboxId: 'professionClassSkillChk', classSkillTextId: 'professionClassSkillText', statSelectId: 'professionStatSelect' },
  { ranksId: 'rideRanks', abilityModId: 'dexMod', totalId: 'rideTotal', classSkillCheckboxId: 'rideClassSkillChk', classSkillTextId: 'rideClassSkillText', statSelectId: 'rideStatSelect' },
  { ranksId: 'senseMotiveRanks', abilityModId: 'wisMod', totalId: 'senseMotiveTotal', classSkillCheckboxId: 'senseMotiveClassSkillChk', classSkillTextId: 'senseMotiveClassSkillText', statSelectId: 'senseMotiveStatSelect' },
  { ranksId: 'sleightOfHandRanks', abilityModId: 'dexMod', totalId: 'sleightOfHandTotal', classSkillCheckboxId: 'sleightOfHandClassSkillChk', classSkillTextId: 'sleightOfHandClassSkillText', statSelectId: 'sleightOfHandStatSelect' },
  { ranksId: 'spellcraftRanks', abilityModId: 'intMod', totalId: 'spellcraftTotal', classSkillCheckboxId: 'spellcraftClassSkillChk', classSkillTextId: 'spellcraftClassSkillText', statSelectId: 'spellcraftStatSelect' },
  { ranksId: 'stealthRanks', abilityModId: 'dexMod', totalId: 'stealthTotal', classSkillCheckboxId: 'stealthClassSkillChk', classSkillTextId: 'stealthClassSkillText', statSelectId: 'stealthStatSelect' },
  { ranksId: 'survivalRanks', abilityModId: 'wisMod', totalId: 'survivalTotal', classSkillCheckboxId: 'survivalClassSkillChk', classSkillTextId: 'survivalClassSkillText', statSelectId: 'survivalStatSelect' },
  { ranksId: 'swimRanks', abilityModId: 'strMod', totalId: 'swimTotal', classSkillCheckboxId: 'swimClassSkillChk', classSkillTextId: 'swimClassSkillText', statSelectId: 'swimStatSelect' },
  { ranksId: 'useMagicDeviceRanks', abilityModId: 'chaMod', totalId: 'useMagicDeviceTotal', classSkillCheckboxId: 'useMagicDeviceClassSkillChk', classSkillTextId: 'useMagicDeviceClassSkillText', statSelectId: 'useMagicDeviceStatSelect' }
];

// --- Saving Throws, Attack, Defense Configs ---
const saveConfigs = [
  { baseId: 'fortBase', totalId: 'fortTotal', abilityModId: 'conMod', statSelectId: 'fortStatSelect', saveName: 'Fortitude', defaultStatKey: 'con' },
  { baseId: 'refBase', totalId: 'refTotal', abilityModId: 'dexMod', statSelectId: 'refStatSelect', saveName: 'Reflex', defaultStatKey: 'dex' },
  { baseId: 'willBase', totalId: 'willTotal', abilityModId: 'wisMod', statSelectId: 'willStatSelect', saveName: 'Will', defaultStatKey: 'wis' }
];

const attackConfigs = [
  { totalId: 'meleeAttack', babId: 'bab', primaryStatModId: 'strMod', sizeModId: 'sizeModAttack', statSelectId: 'meleeAttackStatSelect', defaultStatKey: 'str', name: "Melee Attack" },
  { totalId: 'rangedAttack', babId: 'bab', primaryStatModId: 'dexMod', sizeModId: 'sizeModAttack', statSelectId: 'rangedAttackStatSelect', defaultStatKey: 'dex', name: "Ranged Attack" }
];

const defenseConfig = { // AC
  totalId: 'acTotal',
  dexModId: 'dexMod', // Primary ability modifier for AC
  armorBonusId: 'armorBonus',
  shieldBonusId: 'shieldBonus',
  sizeModAcId: 'sizeModAc',
  naturalArmorId: 'naturalArmor',
  deflectionModId: 'deflectionMod',
  miscAcBonusId: 'miscAcBonus',
  statSelectId: 'acStatSelect',
  defaultStatKey: 'dex' // Default stat for "Double Default" logic if applicable to AC bonuses
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

function updateSkillTotal(skillRanksId, abilityModifierId, skillTotalId, statSelectId) {
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
  if (statSelectId) { // Check if statSelectId is provided (it should be for new functionality)
    const selectedStats = getSelectedStats(statSelectId);
    const defaultStatKeyForSkill = abilityModifierId.replace('Mod', '');

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


// --- Saving Throws ---
function updateSavingThrows() {
  saveConfigs.forEach(config => {
    const baseValue = getIntValue(config.baseId);
    const primaryAbilityMod = getAbilityModifierValue(config.abilityModId);

    let dropdownStatBonus = 0;
    const selectedStats = getSelectedStats(config.statSelectId);
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


// --- Combat Stats ---
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
  const selectedAcStats = getSelectedStats(defenseConfig.statSelectId);
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
    const selectedAttackStats = getSelectedStats(config.statSelectId);
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

// --- Webhook Function ---
function sendToWebhook(webhookData) {
  const webhookUrl = localStorage.getItem('webhookUrl');

  if (!webhookUrl) {
    console.log('[Webhook] No webhook URL configured. Skipping send.');
    return;
  }

  console.log('[Webhook] Sending data to:', webhookUrl, webhookData);

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webhookData),
  })
  .then(response => {
    if (!response.ok) {
      response.text().then(text => {
        console.error('[Webhook] Error sending data:', response.status, response.statusText, text);
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('[Webhook] Data sent successfully:', response.status);
  })
  .catch(error => {
    console.error('[Webhook] Failed to send data:', error);
  });
}

// --- Event Listeners & Initial Calculation ---
document.addEventListener('DOMContentLoaded', () => {
  const rollResultModal = document.getElementById('rollResultModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalResultText = document.getElementById('modalResultText');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  const webhookUrlInput = document.getElementById('webhookUrlInput');
  const saveWebhookBtn = document.getElementById('saveWebhookBtn');
  const webhookStatusMessage = document.getElementById('webhookStatusMessage');
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
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
    const statSelect = document.getElementById(skill.statSelectId);
    if (statSelect) {
      statSelect.addEventListener('change', updateAllCharacterSheetCalculations);
    }
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

  saveConfigs.forEach(config => {
    const statSelect = document.getElementById(config.statSelectId);
    if (statSelect) {
      statSelect.addEventListener('change', updateAllCharacterSheetCalculations);
    }
  });
  attackConfigs.forEach(config => {
    const statSelect = document.getElementById(config.statSelectId);
    if (statSelect) {
      statSelect.addEventListener('change', updateAllCharacterSheetCalculations);
    }
  });
  const acStatSelect = document.getElementById(defenseConfig.statSelectId);
  if (acStatSelect) {
    acStatSelect.addEventListener('change', updateAllCharacterSheetCalculations);
  }
  
  console.assert(calculateAbilityModifier(10) === 0, "Test Failed: Modifier for 10 should be 0");
  console.assert(calculateAbilityModifier(12) === 1, "Test Failed: Modifier for 12 should be 1");
  console.log("calculateAbilityModifier tests completed.");

function rollDice(diceNotationInput) {
  let total = 0;
  let rollsDescription = "Rolls: ";
  const individualRolls = [];
  let modifierSum = 0;
  const storedDiceNotation = diceNotationInput;

  let normalizedNotation = diceNotationInput.trim();
  if (normalizedNotation.startsWith('d')) {
    normalizedNotation = '1' + normalizedNotation;
  }

  const errorReturn = (message) => ({
    total: NaN,
    rollsDescription: message,
    individualRolls: [],
    modifier: 0,
    diceNotation: storedDiceNotation
  });

  const terms = normalizedNotation.match(/[+\-]?[^+\-]+/g) || [];
  let firstTermProcessed = false;

  for (let i = 0; i < terms.length; i++) {
    let term = terms[i];
    let isNegative = term.startsWith('-');
    let termValueStr = term.replace(/^[+\-]/, '');

    if (i === 0 && !term.startsWith('+') && !term.startsWith('-')) {
      isNegative = false;
    }

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
    firstTermProcessed = true;
  }

  rollsDescription += individualRolls.length > 0 ? individualRolls.join(', ') : "None";
  if (modifierSum !== 0 || (terms.some(term => !term.includes('d')) && individualRolls.length > 0) || terms.length === 0 && modifierSum !==0 ) {
    rollsDescription += `. Modifier: ${modifierSum >= 0 ? '+' : ''}${modifierSum}`;
  }
  rollsDescription += `. Total: ${total}`;

  return {
    total: total,
    rollsDescription: rollsDescription,
    individualRolls: individualRolls,
    modifier: modifierSum,
    diceNotation: storedDiceNotation
  };
}

  const addCustomRollBtn = document.getElementById('addCustomRollBtn');
  const customRollFormContainer = document.getElementById('customRollFormContainer');
  const customRollsDisplayContainer = document.getElementById('customRollsDisplayContainer');
  let customRolls = [];

  function createNewRollForm() {
    if (!customRollFormContainer) { console.error('customRollFormContainer not found'); return; }
    if (customRollFormContainer.querySelector('.custom-roll-form')) {
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
    customRollFormContainer.appendChild(formDiv);

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

  if (addCustomRollBtn) addCustomRollBtn.addEventListener('click', createNewRollForm);
  renderCustomRolls();

  const addBonusBtn = document.getElementById('addBonusBtn');
  const bonusFormContainer = document.getElementById('bonusFormContainer');
  const bonusesDisplayContainer = document.getElementById('bonusesDisplayContainer');

  if (addBonusBtn) addBonusBtn.addEventListener('click', createNewBonusForm);
  if (bonusesDisplayContainer) {
    bonusesDisplayContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('delete-bonus-btn')) {
        const bonusDiv = event.target.closest('.displayed-bonus');
        if (bonusDiv && bonusDiv.dataset.bonusId) {
          characterBonuses = characterBonuses.filter(bonus => bonus.id !== bonusDiv.dataset.bonusId);
          renderBonuses();
          updateAllCharacterSheetCalculations();
        }
      }
    });
  }
  renderBonuses();

  function showModal(title, resultContent) {
    if (modalTitle && modalResultText && rollResultModal) {
      modalTitle.textContent = title;
      modalResultText.innerHTML = resultContent;
      rollResultModal.classList.remove('modal-hidden');
      rollResultModal.classList.add('modal-visible');
    }
  }
  function hideModal() {
    if (rollResultModal) {
      rollResultModal.classList.remove('modal-visible');
      rollResultModal.classList.add('modal-hidden');
    }
  }
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

function createNewBonusForm() {
  const bonusFormContainerRef = document.getElementById('bonusFormContainer');
  if (!bonusFormContainerRef) { console.error('bonusFormContainer not found.'); return; }
  if (bonusFormContainerRef.querySelector('.bonus-form')) { alert('A bonus form is already open.'); return; }

  const formDiv = document.createElement('div');
  formDiv.classList.add('bonus-form');
  let formHTML = `<div><label for="bonusTypeSelect_temp">Bonus Type:</label><select id="bonusTypeSelect_temp" name="bonusTypeSelect_temp"><option value="">-- Select Type --</option>${bonusTypes.map(type => `<option value="${type}">${type}</option>`).join('')}</select></div><div><label for="bonusValue_temp">Bonus Value:</label><input type="number" id="bonusValue_temp" name="bonusValue_temp" value="0"></div><div><label>Applies To (select at least one):</label></div><div class="checkbox-group">`;
  bonusApplicationTargets.forEach(target => {
    const checkboxId = `bonusTarget_${target.replace(/\s+/g, '').replace(/[()]/g, '')}_temp`;
    formHTML += `<div style="margin-bottom: 3px;"><input type="checkbox" id="${checkboxId}" name="bonusTarget_temp" value="${target}"><label for="${checkboxId}">${target}</label></div>`;
  });
  formHTML += `</div><div><label for="bonusDescription_temp">Description/Notes:</label><textarea id="bonusDescription_temp" name="bonusDescription_temp" placeholder="e.g., +2 insight to Perception"></textarea></div><div style="margin-top: 10px;"><button class="save-bonus-btn">Save Bonus</button><button type="button" class="cancel-bonus-btn">Cancel</button></div>`;
  formDiv.innerHTML = formHTML;
  bonusFormContainerRef.appendChild(formDiv);

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
