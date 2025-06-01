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
  console.warn(`Element ${elementId} not found, defaulting to 0.`);
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
  { ranksId: 'acrobaticsRanks', abilityModId: 'dexMod', totalId: 'acrobaticsTotal', classSkillCheckboxId: 'acrobaticsClassSkillChk', classSkillTextId: 'acrobaticsClassSkillText' },
  { ranksId: 'appraiseRanks', abilityModId: 'intMod', totalId: 'appraiseTotal', classSkillCheckboxId: 'appraiseClassSkillChk', classSkillTextId: 'appraiseClassSkillText' },
  { ranksId: 'bluffRanks', abilityModId: 'chaMod', totalId: 'bluffTotal', classSkillCheckboxId: 'bluffClassSkillChk', classSkillTextId: 'bluffClassSkillText' },
  { ranksId: 'climbRanks', abilityModId: 'strMod', totalId: 'climbTotal', classSkillCheckboxId: 'climbClassSkillChk', classSkillTextId: 'climbClassSkillText' },
  { ranksId: 'craftRanks', abilityModId: 'intMod', totalId: 'craftTotal', classSkillCheckboxId: 'craftClassSkillChk', classSkillTextId: 'craftClassSkillText' },
  { ranksId: 'diplomacyRanks', abilityModId: 'chaMod', totalId: 'diplomacyTotal', classSkillCheckboxId: 'diplomacyClassSkillChk', classSkillTextId: 'diplomacyClassSkillText' },
  { ranksId: 'disableDeviceRanks', abilityModId: 'dexMod', totalId: 'disableDeviceTotal', classSkillCheckboxId: 'disableDeviceClassSkillChk', classSkillTextId: 'disableDeviceClassSkillText' },
  { ranksId: 'disguiseRanks', abilityModId: 'chaMod', totalId: 'disguiseTotal', classSkillCheckboxId: 'disguiseClassSkillChk', classSkillTextId: 'disguiseClassSkillText' },
  { ranksId: 'escapeArtistRanks', abilityModId: 'dexMod', totalId: 'escapeArtistTotal', classSkillCheckboxId: 'escapeArtistClassSkillChk', classSkillTextId: 'escapeArtistClassSkillText' },
  { ranksId: 'flyRanks', abilityModId: 'dexMod', totalId: 'flyTotal', classSkillCheckboxId: 'flyClassSkillChk', classSkillTextId: 'flyClassSkillText' },
  { ranksId: 'handleAnimalRanks', abilityModId: 'chaMod', totalId: 'handleAnimalTotal', classSkillCheckboxId: 'handleAnimalClassSkillChk', classSkillTextId: 'handleAnimalClassSkillText' },
  { ranksId: 'healRanks', abilityModId: 'wisMod', totalId: 'healTotal', classSkillCheckboxId: 'healClassSkillChk', classSkillTextId: 'healClassSkillText' },
  { ranksId: 'intimidateRanks', abilityModId: 'chaMod', totalId: 'intimidateTotal', classSkillCheckboxId: 'intimidateClassSkillChk', classSkillTextId: 'intimidateClassSkillText' },
  { ranksId: 'knowledgeArcanaRanks', abilityModId: 'intMod', totalId: 'knowledgeArcanaTotal', classSkillCheckboxId: 'knowledgeArcanaClassSkillChk', classSkillTextId: 'knowledgeArcanaClassSkillText' },
  { ranksId: 'knowledgeDungeoneeringRanks', abilityModId: 'intMod', totalId: 'knowledgeDungeoneeringTotal', classSkillCheckboxId: 'knowledgeDungeoneeringClassSkillChk', classSkillTextId: 'knowledgeDungeoneeringClassSkillText' },
  { ranksId: 'knowledgeEngineeringRanks', abilityModId: 'intMod', totalId: 'knowledgeEngineeringTotal', classSkillCheckboxId: 'knowledgeEngineeringClassSkillChk', classSkillTextId: 'knowledgeEngineeringClassSkillText' },
  { ranksId: 'knowledgeGeographyRanks', abilityModId: 'intMod', totalId: 'knowledgeGeographyTotal', classSkillCheckboxId: 'knowledgeGeographyClassSkillChk', classSkillTextId: 'knowledgeGeographyClassSkillText' },
  { ranksId: 'knowledgeHistoryRanks', abilityModId: 'intMod', totalId: 'knowledgeHistoryTotal', classSkillCheckboxId: 'knowledgeHistoryClassSkillChk', classSkillTextId: 'knowledgeHistoryClassSkillText' },
  { ranksId: 'knowledgeLocalRanks', abilityModId: 'intMod', totalId: 'knowledgeLocalTotal', classSkillCheckboxId: 'knowledgeLocalClassSkillChk', classSkillTextId: 'knowledgeLocalClassSkillText' },
  { ranksId: 'knowledgeNatureRanks', abilityModId: 'intMod', totalId: 'knowledgeNatureTotal', classSkillCheckboxId: 'knowledgeNatureClassSkillChk', classSkillTextId: 'knowledgeNatureClassSkillText' },
  { ranksId: 'knowledgeNobilityRanks', abilityModId: 'intMod', totalId: 'knowledgeNobilityTotal', classSkillCheckboxId: 'knowledgeNobilityClassSkillChk', classSkillTextId: 'knowledgeNobilityClassSkillText' },
  { ranksId: 'knowledgePlanesRanks', abilityModId: 'intMod', totalId: 'knowledgePlanesTotal', classSkillCheckboxId: 'knowledgePlanesClassSkillChk', classSkillTextId: 'knowledgePlanesClassSkillText' },
  { ranksId: 'knowledgeReligionRanks', abilityModId: 'intMod', totalId: 'knowledgeReligionTotal', classSkillCheckboxId: 'knowledgeReligionClassSkillChk', classSkillTextId: 'knowledgeReligionClassSkillText' },
  { ranksId: 'linguisticsRanks', abilityModId: 'intMod', totalId: 'linguisticsTotal', classSkillCheckboxId: 'linguisticsClassSkillChk', classSkillTextId: 'linguisticsClassSkillText' },
  { ranksId: 'perceptionRanks', abilityModId: 'wisMod', totalId: 'perceptionTotal', classSkillCheckboxId: 'perceptionClassSkillChk', classSkillTextId: 'perceptionClassSkillText' },
  { ranksId: 'performRanks', abilityModId: 'chaMod', totalId: 'performTotal', classSkillCheckboxId: 'performClassSkillChk', classSkillTextId: 'performClassSkillText' },
  { ranksId: 'professionRanks', abilityModId: 'wisMod', totalId: 'professionTotal', classSkillCheckboxId: 'professionClassSkillChk', classSkillTextId: 'professionClassSkillText' },
  { ranksId: 'rideRanks', abilityModId: 'dexMod', totalId: 'rideTotal', classSkillCheckboxId: 'rideClassSkillChk', classSkillTextId: 'rideClassSkillText' },
  { ranksId: 'senseMotiveRanks', abilityModId: 'wisMod', totalId: 'senseMotiveTotal', classSkillCheckboxId: 'senseMotiveClassSkillChk', classSkillTextId: 'senseMotiveClassSkillText' },
  { ranksId: 'sleightOfHandRanks', abilityModId: 'dexMod', totalId: 'sleightOfHandTotal', classSkillCheckboxId: 'sleightOfHandClassSkillChk', classSkillTextId: 'sleightOfHandClassSkillText' },
  { ranksId: 'spellcraftRanks', abilityModId: 'intMod', totalId: 'spellcraftTotal', classSkillCheckboxId: 'spellcraftClassSkillChk', classSkillTextId: 'spellcraftClassSkillText' },
  { ranksId: 'stealthRanks', abilityModId: 'dexMod', totalId: 'stealthTotal', classSkillCheckboxId: 'stealthClassSkillChk', classSkillTextId: 'stealthClassSkillText' },
  { ranksId: 'survivalRanks', abilityModId: 'wisMod', totalId: 'survivalTotal', classSkillCheckboxId: 'survivalClassSkillChk', classSkillTextId: 'survivalClassSkillText' },
  { ranksId: 'swimRanks', abilityModId: 'strMod', totalId: 'swimTotal', classSkillCheckboxId: 'swimClassSkillChk', classSkillTextId: 'swimClassSkillText' },
  { ranksId: 'useMagicDeviceRanks', abilityModId: 'chaMod', totalId: 'useMagicDeviceTotal', classSkillCheckboxId: 'useMagicDeviceClassSkillChk', classSkillTextId: 'useMagicDeviceClassSkillText' }
];

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

function updateSkillTotal(skillRanksId, abilityModifierId, skillTotalId) {
  const skillConfig = skillConfigs.find(sc => sc.totalId === skillTotalId || sc.ranksId === skillRanksId);

  if (!skillConfig || !skillConfig.classSkillCheckboxId || !skillConfig.classSkillTextId) {
    console.error(`Skill configuration, classSkillCheckboxId, or classSkillTextId not found for skill with totalId: ${skillTotalId} or ranksId: ${skillRanksId}. Check skillConfigs.`);
    const originalRanks = getIntValue(skillRanksId);
    const originalAbilityMod = getIntValue(abilityModifierId);
    const originalItemBonuses = typeof getBonusesForTarget === 'function' ? getBonusesForTarget(skillTotalId) : 0;
    const originalTotalSpan = document.getElementById(skillTotalId);
    if (originalTotalSpan) {
      originalTotalSpan.textContent = originalRanks + originalAbilityMod + originalItemBonuses;
    }
    return;
  }

  const ranks = getIntValue(skillRanksId);
  const abilityModifier = getIntValue(abilityModifierId);

  const classSkillCheckbox = document.getElementById(skillConfig.classSkillCheckboxId);
  const classSkillTextSpan = document.getElementById(skillConfig.classSkillTextId);
  const totalSpan = document.getElementById(skillTotalId);

  let classSkillBonus = 0;
  if (classSkillCheckbox && classSkillCheckbox.checked && ranks >= 1) {
    classSkillBonus = 3;
  }

  if (classSkillTextSpan) {
    if (classSkillCheckbox && classSkillCheckbox.checked) {
      classSkillTextSpan.textContent = "Class Skill";
    } else {
      classSkillTextSpan.textContent = "";
    }
  } else {
    console.warn(`Class skill text span not found for ID: ${skillConfig.classSkillTextId}`);
  }

  const itemBonuses = typeof getBonusesForTarget === 'function' ? getBonusesForTarget(skillTotalId) : 0;

  if (totalSpan) {
    totalSpan.textContent = ranks + abilityModifier + itemBonuses + classSkillBonus;
  } else {
    console.error(`Skill total span (ID: ${skillTotalId}) not found.`);
  }
}

function updateDependentSkills(abilityModId) {
  skillConfigs.forEach(skill => {
    if (skill.abilityModId === abilityModId) {
      updateSkillTotal(skill.ranksId, skill.abilityModId, skill.totalId);
    }
  });
}

// --- Combat Stats ---
function updateCombatStats() {
  const strMod = getIntValue('strMod');
  const dexMod = getIntValue('dexMod');
  const conMod = getIntValue('conMod');

  const hpBase = getIntValue('hpBase');
  document.getElementById('hpTotal').textContent = hpBase + conMod;

  // AC Calculation
  const armorBonusField = getIntValue('armorBonus');
  const shieldBonusField = getIntValue('shieldBonus');
  const sizeModAc = getIntValue('sizeModAc');
  const naturalArmorField = getIntValue('naturalArmor');
  const deflectionModField = getIntValue('deflectionMod');
  const miscAcBonus = getIntValue('miscAcBonus');
  const acBonusesFromBonusesSection = getBonusesForTarget('acTotal');
  document.getElementById('acTotal').textContent = 10 + dexMod + armorBonusField + shieldBonusField + sizeModAc + naturalArmorField + deflectionModField + miscAcBonus + acBonusesFromBonusesSection;

  // Attack Calculations
  const bab = getIntValue('bab');
  const sizeModAttack = getIntValue('sizeModAttack');
  const generalAttackBonuses = getBonusesForTarget('Attack_rolls_general');
  document.getElementById('meleeAttack').textContent = bab + strMod + sizeModAttack + generalAttackBonuses;
  document.getElementById('rangedAttack').textContent = bab + dexMod + sizeModAttack + generalAttackBonuses;

  // CMB/CMD - Assuming general attack bonuses might apply
  const cmbBase = bab + strMod + sizeModAttack;
  const cmdBase = 10 + bab + strMod + dexMod + sizeModAttack;
  document.getElementById('cmbTotal').textContent = cmbBase + getBonusesForTarget('CMB');
  document.getElementById('cmdTotal').textContent = cmdBase + getBonusesForTarget('CMD');

  // Initiative Calculation
  const initiativeMiscMod = getIntValue('initiativeMiscMod');
  const initiativeBonuses = getBonusesForTarget('initiativeTotal');
  document.getElementById('initiativeTotal').textContent = dexMod + initiativeMiscMod + initiativeBonuses;
}

// --- Saving Throws ---
function updateSavingThrows() {
  const conMod = getIntValue('conMod');
  const dexMod = getIntValue('dexMod');
  const wisMod = getIntValue('wisMod');

  const fortBase = getIntValue('fortBase');
  const fortMagicMod = getIntValue('fortMagicMod');
  const fortMiscMod = getIntValue('fortMiscMod');
  const fortBonus = getBonusesForTarget('fortTotal');
  document.getElementById('fortTotal').textContent = fortBase + conMod + fortMagicMod + fortMiscMod + fortBonus;

  const refBase = getIntValue('refBase');
  const refMagicMod = getIntValue('refMagicMod');
  const refMiscMod = getIntValue('refMiscMod');
  const refBonus = getBonusesForTarget('refTotal');
  document.getElementById('refTotal').textContent = refBase + dexMod + refMagicMod + refMiscMod + refBonus;

  const willBase = getIntValue('willBase');
  const willMagicMod = getIntValue('willMagicMod');
  const willMiscMod = getIntValue('willMiscMod');
  const willBonus = getBonusesForTarget('willTotal');
  document.getElementById('willTotal').textContent = willBase + wisMod + willMagicMod + willMiscMod + willBonus;
}

function updateAllCharacterSheetCalculations() {
  console.log("[DEBUG] updateAllCharacterSheetCalculations called");

  // Step 1: Apply bonuses to raw ability scores and update their modifiers
  const tempEffectiveScores = {};
  abilityScoreConfigs.forEach(config => {
    const baseScore = getIntValue(config.scoreId);
    const scoreBonus = getBonusesForTarget(config.scoreId);
    const effectiveScore = baseScore + scoreBonus;
    tempEffectiveScores[config.scoreId] = effectiveScore;

    const modSpan = document.getElementById(config.modId);
    if (modSpan) {
      modSpan.textContent = calculateAbilityModifier(effectiveScore);
    }
  });

  // Step 2: Update combat stats, saving throws (they will use the new modifier values via getIntValue)
  updateCombatStats();
  updateSavingThrows();

  // Step 3: Update all skills
  skillConfigs.forEach(skill => {
    updateSkillTotal(skill.ranksId, skill.abilityModId, skill.totalId);
  });
  console.log("[DEBUG] updateAllCharacterSheetCalculations completed");
}


// --- Event Listeners & Initial Calculation ---
document.addEventListener('DOMContentLoaded', () => {
  // Modal Elements
  const rollResultModal = document.getElementById('rollResultModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalResultText = document.getElementById('modalResultText');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  // Webhook UI Elements
  const webhookUrlInput = document.getElementById('webhookUrlInput');
  const saveWebhookBtn = document.getElementById('saveWebhookBtn');
  const webhookStatusMessage = document.getElementById('webhookStatusMessage');

  // Theme switching logic
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
        // Or localStorage.removeItem('theme');
      }
    });
  } else {
    console.warn('Theme toggle button (themeToggleBtn) not found.');
  }

  // Initial calculation for ability scores needs to be part of the full update cycle
  // to correctly incorporate any initially defined bonuses (if data persistence were added).
  // updateAbilityModifierDisplay and updateDependentSkills are called by updateAllCharacterSheetCalculations.

  // Add event listeners to ability score inputs
  abilityScoreConfigs.forEach(ability => {
    const scoreInput = document.getElementById(ability.scoreId);
    if (scoreInput) {
      scoreInput.addEventListener('input', () => {
        updateAbilityModifierDisplay(ability.scoreId, ability.modId);
        updateAllCharacterSheetCalculations();
      });
    }
  });

  // Initial calculation for all skills and add event listeners
  skillConfigs.forEach((skill) => {
    const ranksInput = document.getElementById(skill.ranksId);
    if (ranksInput) {
      ranksInput.addEventListener('input', () => {
        updateAllCharacterSheetCalculations();
      });
    }
  });
  
  // Event listeners for combat stats and saving throw base values
  const inputIdsToTriggerFullRecalc = [
    'hpBase', 'armorBonus', 'shieldBonus', 'sizeModAc', 'naturalArmor', 
    'deflectionMod', 'miscAcBonus', 'bab', 'sizeModAttack', 'initiativeMiscMod',
    'fortBase', 'fortMagicMod', 'fortMiscMod',
    'refBase', 'refMagicMod', 'refMiscMod',
    'willBase', 'willMagicMod', 'willMiscMod'
  ];

  inputIdsToTriggerFullRecalc.forEach(inputId => {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.addEventListener('input', updateAllCharacterSheetCalculations);
    }
  });
  
  // --- Basic Assertions for calculateAbilityModifier ---
  console.assert(calculateAbilityModifier(10) === 0, "Test Failed: Modifier for 10 should be 0");
  console.assert(calculateAbilityModifier(12) === 1, "Test Failed: Modifier for 12 should be 1");
  console.assert(calculateAbilityModifier(7) === -2, "Test Failed: Modifier for 7 should be -2");
  console.assert(calculateAbilityModifier(20) === 5, "Test Failed: Modifier for 20 should be 5");
  console.assert(calculateAbilityModifier(1) === -5, "Test Failed: Modifier for 1 should be -5");
  console.log("calculateAbilityModifier tests completed.");

// --- Dice Rolling Function ---
function rollDice(diceNotationInput) {
  let total = 0;
  let rollsDescription = "Rolls: ";
  const individualRolls = [];
  // const modifiers = []; // Store modifiers with their signs and values - Replaced by modifierSum
  let modifierSum = 0;
  const storedDiceNotation = diceNotationInput; // Store original input

  // Normalize input: remove whitespace and handle "d6" as "1d6"
  let normalizedNotation = diceNotationInput.trim();

 if (normalizedNotation.startsWith('d')) {
    normalizedNotation = '1' + normalizedNotation;
  }

  // Error return object
  const errorReturn = (message) => ({
    total: NaN,
    rollsDescription: message,
    individualRolls: [],
    modifier: 0,
    diceNotation: storedDiceNotation
  });

  // Split by '+' and '-' to separate terms, keeping delimiters
  // e.g., "2d6+5-1d4-2" -> ["2d6", "+5", "-1d4", "-2"]
  // e.g., "d20-1" -> ["1d20", "-1"] (after normalization)
  // e.g., "5+2d6" -> ["5", "+2d6"]
  const terms = normalizedNotation.match(/[+\-]?[^+\-]+/g) || [];

  let firstTermProcessed = false;

  for (let i = 0; i < terms.length; i++) {
    let term = terms[i];
    let isNegative = term.startsWith('-');
    let termValueStr = term.replace(/^[+\-]/, '');

    // If it's the first term and has no sign, it's implicitly positive.
    if (i === 0 && !term.startsWith('+') && !term.startsWith('-')) {
      isNegative = false;
    }

    if (termValueStr.includes('d')) {
      // Dice term
      let [numDiceStr, numSidesStr] = termValueStr.split('d');
      let numDice = numDiceStr === '' ? 1 : parseInt(numDiceStr, 10);
      let numSides = parseInt(numSidesStr, 10);

      if (isNaN(numDice) || numDice <= 0) {
        return errorReturn(`Error: Invalid number of dice '${numDiceStr}' in term '${term}'`);
      }
      if (isNaN(numSides) || numSides <= 0) {
        return errorReturn(`Error: Invalid number of sides '${numSidesStr}' in term '${term}'`);
      }

      for (let j = 0; j < numDice; j++) {
        const roll = Math.floor(Math.random() * numSides) + 1;
        individualRolls.push(roll);
        if (isNegative) {
          total -= roll;
        } else {
          total += roll;
        }
      }
    } else {
      // Modifier term
      const modifierVal = parseInt(termValueStr, 10);
      if (isNaN(modifierVal)) {
        return errorReturn(`Error: Invalid modifier '${termValueStr}' in term '${term}'`);
      }

      if (isNegative) {
        total -= modifierVal;
        modifierSum -= modifierVal;
      } else {
        // This handles explicitly positive terms like "+5" or first terms like "5"
        total += modifierVal;
        modifierSum += modifierVal;
      }
    }
    firstTermProcessed = true;
  }

  rollsDescription += individualRolls.length > 0 ? individualRolls.join(', ') : "None";

  if (modifierSum !== 0 || (terms.some(term => !term.includes('d')) && individualRolls.length > 0) || terms.length === 0 && modifierSum !==0 ) {
     // Show modifier if it's non-zero, or if there was any modifier term and also dice, or if it's just a number
    rollsDescription += `. Modifier: ${modifierSum >= 0 ? '+' : ''}${modifierSum}`;
  }

  // The duplicate if (modifierSum !== 0 ...) block and the if (modifiers.length > 0) block
  // were targeted for removal in a previous subtask. It seems that removal might have failed or
  // been partial, as they were still present in some of my earlier `read_files` outputs for this subtask.
  // For this overwrite, I will ensure only the correct single modifierSum block is present.
  // If those blocks are still there, this overwrite will remove them. If they are already gone, this is fine.

  rollsDescription += `. Total: ${total}`;

  return {
    total: total,
    rollsDescription: rollsDescription,
    individualRolls: individualRolls,
    modifier: modifierSum,
    diceNotation: storedDiceNotation // or normalizedNotation, depending on desired output
  };
}
// --- Custom Dice Rolls --- //
  const addCustomRollBtn = document.getElementById('addCustomRollBtn');
  const customRollFormContainer = document.getElementById('customRollFormContainer');
  const customRollsDisplayContainer = document.getElementById('customRollsDisplayContainer');
  let customRolls = [];

  function createNewRollForm() {
    if (!customRollFormContainer) {
        console.error('customRollFormContainer not found');
        return;
    }

    const formDiv = document.createElement('div');
    formDiv.classList.add('custom-roll-form');

    let formHTML = `
        <div>
            <label for="rollDescription_temp">Description:</label>
            <input type="text" class="roll-description-input" name="rollDescription_temp" placeholder="e.g., Longsword Damage">
        </div>
        <div><label>Dice (enter quantity):</label></div>
        <div style="display: flex; flex-wrap: wrap;">`;

    const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
    diceTypes.forEach(die => {
        formHTML += `
            <div style="margin-right: 10px; margin-bottom: 5px; display: flex; align-items: center;">
                <label class="dice-label" for="${die}_count_temp" style="min-width: auto; margin-right: 3px;">${die}:</label>
                <input type="number" class="dice-input" data-die="${die}" name="${die}_count_temp" value="0" min="0" style="width: 45px;">
            </div>`;
    });
    formHTML += `</div>`;
    formHTML += `<div style="margin-top: 10px;">`;
    formHTML += `<button class="save-roll-btn">Save Roll</button>`;
    formHTML += `<button class="cancel-roll-btn" type="button" style="margin-left: 10px; background-color: #f44336; color:white; border:none; padding: 6px 12px; border-radius:3px; cursor:pointer;">Cancel</button>`;
    formHTML += `</div>`;

    formDiv.innerHTML = formHTML;
    customRollFormContainer.appendChild(formDiv);

    const saveBtn = formDiv.querySelector('.save-roll-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            const descriptionInput = formDiv.querySelector('.roll-description-input');
            const description = descriptionInput ? descriptionInput.value.trim() : '';
            
            const diceCounts = [];
            formDiv.querySelectorAll('.dice-input').forEach(input => {
                const count = parseInt(input.value, 10);
                if (count > 0) {
                    diceCounts.push({ die: input.dataset.die, count: count });
                }
            });

            if (description === '' && diceCounts.length === 0) {
                alert("Please enter a description or at least one die for the roll.");
                return;
            }
            if (diceCounts.length === 0) {
                 alert("Please specify at least one die to roll.");
                 return;
             }

            const newRoll = {
                id: Date.now().toString(),
                description: description || "Custom Roll",
                dice: diceCounts
            };

            customRolls.push(newRoll);
            renderCustomRolls();
            formDiv.remove(); 
        });
    } else {
        console.error('Save button not found in new roll form.');
    }

    const cancelBtn = formDiv.querySelector('.cancel-roll-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            formDiv.remove(); 
        });
    } else {
        console.error('Cancel button not found in new roll form.');
    }
  }

  function renderCustomRolls() {
      if (!customRollsDisplayContainer) {
          console.error('customRollsDisplayContainer not found');
          return;
      }
      customRollsDisplayContainer.innerHTML = '';

      customRolls.forEach(roll => {
          const rollDiv = document.createElement('div');
          rollDiv.classList.add('displayed-roll');
          rollDiv.dataset.rollId = roll.id;

          const descriptionSpan = document.createElement('span');
          descriptionSpan.classList.add('roll-description');
          descriptionSpan.textContent = roll.description;

          const diceSummarySpan = document.createElement('span');
          diceSummarySpan.classList.add('roll-dice-summary');
          diceSummarySpan.textContent = roll.dice.map(d => `${d.count}${d.die}`).join(' + ');

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.style.marginLeft = '10px'; // Keep margin for spacing from roll button
          deleteBtn.style.padding = '3px 8px';
          deleteBtn.style.backgroundColor = '#dc3545';
          deleteBtn.style.color = 'white';
          deleteBtn.style.border = 'none';
          deleteBtn.style.borderRadius = '3px';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.addEventListener('click', function() {
              customRolls = customRolls.filter(r => r.id !== roll.id);
              renderCustomRolls();
          });

          const rollActionBtn = document.createElement('button');
          rollActionBtn.textContent = 'Roll';
          rollActionBtn.classList.add('roll-custom-btn');
          rollActionBtn.style.marginLeft = '5px'; // Space from dice summary
          rollActionBtn.style.padding = '3px 8px'; // Match delete button padding for consistency
          rollActionBtn.style.backgroundColor = '#28a745'; // A green color for roll
          rollActionBtn.style.color = 'white';
          rollActionBtn.style.border = 'none';
          rollActionBtn.style.borderRadius = '3px';
          rollActionBtn.style.cursor = 'pointer';

          rollActionBtn.addEventListener('click', function() {
            let diceNotation = roll.dice.map(d => `${d.count}${d.die}`).join('+');
            if (!diceNotation) {
                showModal(`${roll.description} Roll Error`, "No dice specified for this roll.");
                return;
            }
            const result = rollDice(diceNotation);
            showModal(`${roll.description} Roll`, result.rollsDescription);

            // Prepare and send to webhook
            const webhookData = {
              roll_type: `Custom: ${roll.description}`,
              dice_notation: result.diceNotation, // or just diceNotation variable from above
              individual_rolls: result.individualRolls,
              modifier: result.modifier,
              total: result.total,
              full_description: result.rollsDescription
            };
            sendToWebhook(webhookData);
          });

          rollDiv.appendChild(descriptionSpan);
          rollDiv.appendChild(diceSummarySpan);
          rollDiv.appendChild(rollActionBtn); // Roll button before delete button
          rollDiv.appendChild(deleteBtn);
          customRollsDisplayContainer.appendChild(rollDiv);
      });
  }

  if (addCustomRollBtn) {
    addCustomRollBtn.addEventListener('click', createNewRollForm);
  } else {
    console.error('Main "Add Custom Roll" button (addCustomRollBtn) not found.');
  }
  renderCustomRolls();
  // --- End Custom Dice Rolls --- //

  // --- Bonuses --- //
  const addBonusBtn = document.getElementById('addBonusBtn');
  const bonusFormContainer = document.getElementById('bonusFormContainer');
  const bonusesDisplayContainer = document.getElementById('bonusesDisplayContainer');

  if (addBonusBtn) {
    console.log('[DEBUG] Setting up click listener for addBonusBtn.');
    addBonusBtn.addEventListener('click', createNewBonusForm);
  } else {
    console.error('Add Bonus button (addBonusBtn) not found.');
  }

  if (bonusesDisplayContainer) {
    bonusesDisplayContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('delete-bonus-btn')) {
        const bonusDiv = event.target.closest('.displayed-bonus');
        if (bonusDiv && bonusDiv.dataset.bonusId) {
          const bonusIdToDelete = bonusDiv.dataset.bonusId;
          characterBonuses = characterBonuses.filter(bonus => bonus.id !== bonusIdToDelete);
          renderBonuses();
          updateAllCharacterSheetCalculations();
        }
      }
    });
  } else {
    console.error('Bonuses display container (bonusesDisplayContainer) not found for delete listener.');
  }

  renderBonuses();
  updateAllCharacterSheetCalculations(); // Initial full calculation

  // Add event listeners to class skill checkboxes
  console.log('[DEBUG] Setting up event listeners for class skill checkboxes.');
  skillConfigs.forEach(skillConfig => {
    if (skillConfig.classSkillCheckboxId) {
      const classSkillCheckbox = document.getElementById(skillConfig.classSkillCheckboxId);
      if (classSkillCheckbox) {
        classSkillCheckbox.addEventListener('change', () => {
          console.log(`[DEBUG] Class skill checkbox changed for: ${skillConfig.ranksId}`);
          updateAllCharacterSheetCalculations();
        });
      } else {
        console.warn(`Class skill checkbox not found for ID: ${skillConfig.classSkillCheckboxId}`);
      }
    } else {
      console.warn(`classSkillCheckboxId missing in skillConfig for ranksId: ${skillConfig.ranksId}`);
    }
  });
  console.log('[DEBUG] Finished setting up event listeners for class skill checkboxes.');

  // --- Modal Functions ---
  function showModal(title, resultContent) {
    if (modalTitle && modalResultText && rollResultModal) {
      modalTitle.textContent = title;
      modalResultText.innerHTML = resultContent; // Using innerHTML to allow for formatted descriptions
      rollResultModal.classList.remove('modal-hidden');
      rollResultModal.classList.add('modal-visible');
    } else {
      console.error('Modal elements not found!');
    }
  }

  function hideModal() {
    if (rollResultModal) {
      rollResultModal.classList.remove('modal-visible');
      rollResultModal.classList.add('modal-hidden');
    }
  }

  // --- Modal Event Listeners ---
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', hideModal);
  }
  if (rollResultModal) {
    // Optional: Close modal if user clicks outside the modal content
    rollResultModal.addEventListener('click', function(event) {
      if (event.target === rollResultModal) { // Check if the click is on the overlay itself
        hideModal();
      }
    });
  }

  // Example usage (can be removed or tied to actual roll button later):
  // document.getElementById('someButtonToTestModal').addEventListener('click', () => {
  //   const rollResult = rollDice("1d20+5");
  //   showModal("Test Roll: 1d20+5", `${rollResult.rollsDescription}<br><br>Total: ${rollResult.total}`);
  // });

  // --- Skill and Stat Roll Button Event Listeners ---
  document.querySelectorAll('.roll-skill-btn').forEach(button => {
    button.addEventListener('click', function() {
      const skillName = this.dataset.skillname;
      const totalId = this.dataset.totalid;
      const skillTotalElement = document.getElementById(totalId);
      if (skillTotalElement) {
        const bonus = parseInt(skillTotalElement.textContent, 10) || 0;
        const rollNotation = `1d20+${bonus}`;
        const result = rollDice(rollNotation);
        showModal(`${skillName} Roll`, result.rollsDescription);

        // Prepare and send to webhook
        const webhookData = {
          roll_type: `Skill: ${skillName}`,
          dice_notation: result.diceNotation,
          individual_rolls: result.individualRolls,
          modifier: result.modifier,
          total: result.total,
          full_description: result.rollsDescription
        };
        sendToWebhook(webhookData);
      } else {
        console.error('Skill total element not found for ID:', totalId);
        showModal(`${skillName} Roll Error`, "Could not find skill total to perform roll.");
      }
    });
  });

  document.querySelectorAll('.roll-stat-btn').forEach(button => {
    button.addEventListener('click', function() {
      const statName = this.dataset.statname;
      const modId = this.dataset.modid;
      const statModElement = document.getElementById(modId);
      if (statModElement) {
        const bonus = parseInt(statModElement.textContent, 10) || 0;
        const rollNotation = `1d20+${bonus}`;
        const result = rollDice(rollNotation);
        showModal(`${statName}`, result.rollsDescription);

        // Prepare and send to webhook
        const webhookData = {
          roll_type: `Stat: ${statName}`,
          dice_notation: result.diceNotation,
          individual_rolls: result.individualRolls,
          modifier: result.modifier,
          total: result.total,
          full_description: result.rollsDescription
        };
        sendToWebhook(webhookData);
      } else {
        console.error('Stat modifier element not found for ID:', modId);
        showModal(`${statName} Error`, "Could not find stat modifier to perform roll.");
      }
    });
  });

  // --- Webhook URL Load and Save ---
  if (webhookUrlInput) {
    const savedWebhookUrl = localStorage.getItem('webhookUrl');
    if (savedWebhookUrl) {
      webhookUrlInput.value = savedWebhookUrl;
      if (webhookStatusMessage) {
        webhookStatusMessage.textContent = 'Saved Webhook URL loaded.';
        setTimeout(() => { webhookStatusMessage.textContent = ''; }, 3000);
      }
    }
  }

  if (saveWebhookBtn && webhookUrlInput && webhookStatusMessage) {
    saveWebhookBtn.addEventListener('click', function() {
      const urlToSave = webhookUrlInput.value.trim();
      localStorage.setItem('webhookUrl', urlToSave);
      webhookStatusMessage.textContent = 'Webhook URL saved!';
      setTimeout(() => { webhookStatusMessage.textContent = ''; }, 3000);
    });
  } else {
    if (!saveWebhookBtn) console.error('Save Webhook Button (saveWebhookBtn) not found.');
    if (!webhookUrlInput) console.error('Webhook URL Input (webhookUrlInput) not found.');
    if (!webhookStatusMessage) console.error('Webhook Status Message (webhookStatusMessage) not found.');
  }

});

function createNewBonusForm() {
  console.log('[DEBUG] createNewBonusForm called.');

  const bonusFormContainerRef = document.getElementById('bonusFormContainer');
  if (!bonusFormContainerRef) {
    console.error('[DEBUG] bonusFormContainer not found from within createNewBonusForm.');
    return;
  }

  console.log('[DEBUG] bonusFormContainerRef.innerHTML before check:', bonusFormContainerRef.innerHTML);

  if (bonusFormContainerRef.querySelector('.bonus-form')) {
    console.log('[DEBUG] Existing .bonus-form found. Aborting new form creation.');
    alert('A bonus form is already open. Please complete or cancel it first.');
    return;
  }
  console.log('[DEBUG] No existing .bonus-form found. Proceeding to create new form.');


  const formDiv = document.createElement('div');
  formDiv.classList.add('bonus-form');

  let formHTML = `
    <div>
      <label for="bonusTypeSelect_temp">Bonus Type:</label>
      <select id="bonusTypeSelect_temp" name="bonusTypeSelect_temp">
        <option value="">-- Select Type --</option>
        ${bonusTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
      </select>
    </div>
    <div>
      <label for="bonusValue_temp">Bonus Value:</label>
      <input type="number" id="bonusValue_temp" name="bonusValue_temp" value="0">
    </div>
    <div><label>Applies To (select at least one):</label></div>
    <div class="checkbox-group">`;

  bonusApplicationTargets.forEach(target => {
    const checkboxId = `bonusTarget_${target.replace(/\s+/g, '').replace(/[()]/g, '')}_temp`;
    formHTML += `
      <div style="margin-bottom: 3px;">
          <input type="checkbox" id="${checkboxId}" name="bonusTarget_temp" value="${target}">
          <label for="${checkboxId}">${target}</label>
      </div>`;
  });

  formHTML += `
    </div>
    <div>
      <label for="bonusDescription_temp">Description/Notes:</label>
      <textarea id="bonusDescription_temp" name="bonusDescription_temp" placeholder="e.g., +2 insight bonus to Perception checks for spotting traps"></textarea>
    </div>
    <div style="margin-top: 10px;">
      <button class="save-bonus-btn">Save Bonus</button>
      <button type="button" class="cancel-bonus-btn">Cancel</button>
    </div>`;

  formDiv.innerHTML = formHTML;
  bonusFormContainerRef.appendChild(formDiv);
  console.log('[DEBUG] New bonus form appended to bonusFormContainerRef.');

  const saveBtn = formDiv.querySelector('.save-bonus-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const selectedType = formDiv.querySelector('#bonusTypeSelect_temp').value;
      const bonusValue = parseInt(formDiv.querySelector('#bonusValue_temp').value, 10) || 0;
      const descriptionText = formDiv.querySelector('#bonusDescription_temp').value;

      const selectedTargets = [];
      formDiv.querySelectorAll('input[name="bonusTarget_temp"]:checked').forEach(checkbox => {
        selectedTargets.push(checkbox.value);
      });

      if (!selectedType) { alert("Please select a bonus type."); return; }
      if (selectedTargets.length === 0) { alert("Please select at least one target for the bonus."); return; }

      const newBonus = {
        id: Date.now().toString(),
        type: selectedType,
        appliesTo: selectedTargets,
        value: bonusValue,
        description: descriptionText.trim()
      };
      characterBonuses.push(newBonus);
      renderBonuses();
      updateAllCharacterSheetCalculations();
      formDiv.remove();
    });
  } else {
    console.error('[DEBUG] Save Bonus button not found in new bonus form.');
  }

  const cancelBtn = formDiv.querySelector('.cancel-bonus-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      formDiv.remove();
    });
  } else {
    console.error('[DEBUG] Cancel Bonus button not found in new bonus form.');
  }
}

function renderBonuses() {
  const displayContainer = document.getElementById('bonusesDisplayContainer');
  if (!displayContainer) {
    console.error('bonusesDisplayContainer not found for rendering');
    return;
  }
  displayContainer.innerHTML = '';

  characterBonuses.forEach(bonus => {
    const bonusDiv = document.createElement('div');
    bonusDiv.classList.add('displayed-bonus');
    bonusDiv.dataset.bonusId = bonus.id;

    const summaryP = document.createElement('p');
    summaryP.classList.add('bonus-summary');
    const valueString = bonus.value >= 0 ? `+${bonus.value}` : bonus.value.toString();
    summaryP.textContent = `Type: ${bonus.type} (${valueString})`;

    const appliesToP = document.createElement('p');
    appliesToP.classList.add('bonus-applies-to');
    appliesToP.textContent = `Applies to: ${bonus.appliesTo.join(', ')}`;

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('bonus-description');
    descriptionP.textContent = bonus.description || '(No description)';

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-bonus-btn');
    deleteBtn.textContent = 'Delete';

    bonusDiv.appendChild(deleteBtn);
    bonusDiv.appendChild(summaryP);
    bonusDiv.appendChild(appliesToP);
    if (bonus.description) {
        bonusDiv.appendChild(descriptionP);
    }

    displayContainer.appendChild(bonusDiv);
  });
}
