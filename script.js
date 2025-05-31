// --- Global Bonus Data ---
const bonusTypes = [
  "Alchemical", "Armour", "Circumstance", "Competence", "Deflection",
  "Dodge", "Enhancement", "Inherent", "Insight", "Luck", "Morale",
  "Natural Armour", "Profane", "Racial", "Sacred", "Shield", "Size", "Trait"
];

// The old bonusApplicationTargets is removed / replaced by the one generated below.
// let characterBonuses = []; // This will be moved after the new definitions.

// --- Ability Scores ---
// Ensure skillConfigs is defined before this section.
// It is defined later in the provided script.js, so this will be a structural change.
// For this operation, we will assume skillConfigs is available globally when this runs.
// The actual definition of skillConfigs will be kept where it is, but its content is needed here.

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

// skillConfigs will be used here but is defined later in the file.
// This is a known structural dependency. The provided code assumes skillConfigs exists.
// In a real refactor, skillConfigs would be moved before this or passed/accessed differently.
// For now, we proceed with the assumption it's accessible.
const skillBonusMappings = {};
// skillConfigs needs to be accessible here.
// We will populate this dynamically AFTER skillConfigs is defined.
// This means the generation of bonusTargetMappings and bonusApplicationTargets
// will also need to be done after skillConfigs is defined.

// Placeholder for skillConfigs-dependent mappings
// const bonusTargetMappings = { ...coreBonusMappings, ...skillBonusMappings };
// const bonusApplicationTargets = Object.keys(bonusTargetMappings);

let characterBonuses = [];

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


// --- Global Bonus Data Setup (Postponed part due to skillConfigs dependency) ---
// This section will be moved down to be after skillConfigs is defined.
// For now, we'll define a temporary bonusApplicationTargets for the form to work.
// This is a workaround for the current subtask, real solution is reordering.

const TEMPORARY_bonusApplicationTargets_UNTIL_REORDER = [
  "AC", "Fortitude Save", "Reflex Save", "Will Save",
  "Attack Rolls", "Damage Rolls", "Initiative", "Strength Score", "Dexterity Score",
  "Constitution Score", "Intelligence Score", "Wisdom Score", "Charisma Score",
  // Skills will be missing here until full reordering
];


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
// Now that skillConfigs is defined, we can fully define the bonus mappings.

skillConfigs.forEach(skill => {
  const skillNamePart = skill.ranksId.replace('Ranks', '');
  // Correctly create a user-friendly name, e.g., "Knowledge (Arcana)" from "knowledgeArcana"
  let userFriendlyName = skillNamePart.replace(/([A-Z])/g, ' $1').trim(); // Add space before capitals
  userFriendlyName = userFriendlyName.charAt(0).toUpperCase() + userFriendlyName.slice(1) + " Skill";
  // Handle "Knowledge" skills specifically if they need different formatting
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
  const applicableBonusesByType = {}; // To handle stacking for named bonuses

  for (const bonus of characterBonuses) {
    // Check if this bonus applies to the targetKey
    let applies = false;
    for (const appliesToName of bonus.appliesTo) {
      // 'appliesToName' is the user-friendly name from the checkbox, e.g., "Fortitude Save"
      // We need to look up its mapping in bonusTargetMappings
      if (bonusTargetMappings[appliesToName] && bonusTargetMappings[appliesToName].targetKey === targetKey) {
        applies = true;
        break;
      }
    }

    if (applies) {
      const bonusType = bonus.type;
      const bonusValue = parseInt(bonus.value, 10) || 0;

      // Pathfinder stacking: same type doesn't stack, take highest. Different types stack.
      // "Trait" and "Racial" are handled by this logic if they are in `bonusTypes`.
      // Dodge, Circumstance, and Untyped bonuses stack with themselves and others.
      if (bonusType === "Dodge" || bonusType === "Circumstance" || !bonusTypes.includes(bonusType)) {
        // These types stack or are untyped
        totalBonus += bonusValue;
      } else { // It's a named bonus type that doesn't stack with itself (e.g. Morale, Competence, etc.)
        if (!applicableBonusesByType[bonusType] || Math.abs(bonusValue) > Math.abs(applicableBonusesByType[bonusType].value)) {
          // Store the bonus if it's the first of its type or has a larger absolute magnitude
          applicableBonusesByType[bonusType] = { value: bonusValue, type: bonusType };
        }
      }
    }
  }

  // Sum up the highest value for each named bonus type that was stored
  for (const type in applicableBonusesByType) {
    totalBonus += applicableBonusesByType[type].value;
  }
  return totalBonus;
}

function updateSkillTotal(skillRanksId, abilityModifierId, skillTotalId) {
  const skillConfig = skillConfigs.find(sc => sc.totalId === skillTotalId || sc.ranksId === skillRanksId);

  if (!skillConfig || !skillConfig.classSkillCheckboxId || !skillConfig.classSkillTextId) {
    console.error(`Skill configuration, classSkillCheckboxId, or classSkillTextId not found for skill with totalId: ${skillTotalId} or ranksId: ${skillRanksId}. Check skillConfigs.`);
    // Fallback calculation in case skillConfig or its new properties are unexpectedly missing
    const originalRanks = getIntValue(skillRanksId);
    // The abilityModifierId is the ID of the modifier span, e.g., 'dexMod'.
    // So getIntValue(abilityModifierId) correctly fetches the modifier value.
    const originalAbilityMod = getIntValue(abilityModifierId);
    const originalItemBonuses = typeof getBonusesForTarget === 'function' ? getBonusesForTarget(skillTotalId) : 0;
    const originalTotalSpan = document.getElementById(skillTotalId);
    if (originalTotalSpan) {
      originalTotalSpan.textContent = originalRanks + originalAbilityMod + originalItemBonuses;
    }
    return; // Exit if essential config for class skill feature is missing
  }

  const ranks = getIntValue(skillRanksId);
// feature/bonuses-section
  // The abilityModifierId is the ID of the modifier span, e.g., 'dexMod'.
  // So getIntValue(abilityModifierId) correctly fetches the modifier value.
  const abilityModifier = getIntValue(abilityModifierId);

  const classSkillCheckbox = document.getElementById(skillConfig.classSkillCheckboxId);
  const classSkillTextSpan = document.getElementById(skillConfig.classSkillTextId);
  const totalSpan = document.getElementById(skillTotalId);

  let classSkillBonus = 0;
  // Calculate class skill bonus
  if (classSkillCheckbox && classSkillCheckbox.checked && ranks >= 1) {
    classSkillBonus = 3;
  }

  // Update "Class Skill" text display
  if (classSkillTextSpan) {
    if (classSkillCheckbox && classSkillCheckbox.checked) {
      classSkillTextSpan.textContent = "Class Skill";
    } else {
      classSkillTextSpan.textContent = ""; // Clear text if not a class skill or box unchecked
    }
  } else {
    // This is not critical enough to halt, but good to know if it's missing.
    console.warn(`Class skill text span not found for ID: ${skillConfig.classSkillTextId}`);
  }

  // Get bonuses from the "Bonuses" section (using skillTotalId as targetKey)
  const itemBonuses = typeof getBonusesForTarget === 'function' ? getBonusesForTarget(skillTotalId) : 0;

  // Update total display
  if (totalSpan) {
    totalSpan.textContent = ranks + abilityModifier + itemBonuses + classSkillBonus;
=======
  const abilityModifier = getIntValue(abilityModifierId); // This is the modifier value from the span
  const totalSpan = document.getElementById(skillTotalId);

  // Get bonuses for this specific skill (skillTotalId is the targetKey)
  const skillBonus = getBonusesForTarget(skillTotalId);

  if (totalSpan) {
    totalSpan.textContent = ranks + abilityModifier + skillBonus;
// main
  } else {
    // This error should ideally not happen if skillConfig was found.
    console.error(`Skill total span (ID: ${skillTotalId}) not found.`);
  }
}

// updateDependentSkills is called when an ability score INPUT changes.
// It should use the new updateAllCharacterSheetCalculations to ensure bonuses are included.
// However, the direct trigger for updateDependentSkills is already inside updateAbilityModifierDisplay logic,
// which is part of the chain reaction from ability score input.
// The new central function updateAllCharacterSheetCalculations will handle skill updates.
// So, we might not need to change updateDependentSkills itself, but ensure its calls are correct
// or superseded by calls to updateAllCharacterSheetCalculations.
// For now, let's keep it, as it's called by the original ability score update logic.
// The main update function will call updateSkillTotal for all skills anyway.

function updateDependentSkills(abilityModId) {
  skillConfigs.forEach(skill => {
    if (skill.abilityModId === abilityModId) {
      // This will now include bonuses due to the change in updateSkillTotal
      updateSkillTotal(skill.ranksId, skill.abilityModId, skill.totalId);
    }
  });
}

// --- Combat Stats ---
function updateCombatStats() {
  const strMod = getIntValue('strMod');
  const dexMod = getIntValue('dexMod');
  const conMod = getIntValue('conMod'); // Needed for HP

  const hpBase = getIntValue('hpBase'); // HP calculation remains the same for now
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
  const cmbBase = bab + strMod + sizeModAttack; // Base CMB without general attack bonuses that might not apply to maneuvers
  const cmdBase = 10 + bab + strMod + dexMod + sizeModAttack; // Base CMD
  // TODO: Consider specific CMB/CMD bonuses if added to bonusTargetMappings
  document.getElementById('cmbTotal').textContent = cmbBase + getBonusesForTarget('CMB'); // Assuming 'CMB' could be a targetKey
  document.getElementById('cmdTotal').textContent = cmdBase + getBonusesForTarget('CMD'); // Assuming 'CMD' could be a targetKey

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
    // updateSkillTotal internally calls getIntValue(skill.abilityModId)
    // which now correctly reflects the modifier from the effective score.
    updateSkillTotal(skill.ranksId, skill.abilityModId, skill.totalId);
  });
  console.log("[DEBUG] updateAllCharacterSheetCalculations completed");
}


// --- Event Listeners & Initial Calculation ---
document.addEventListener('DOMContentLoaded', () => {
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
        // When a raw ability score is manually changed, we need to update its modifier first,
        // then trigger a full recalculation to ensure all dependent stats and bonuses are applied.
        // The original updateAbilityModifierDisplay is fine for the direct mod.
        updateAbilityModifierDisplay(ability.scoreId, ability.modId);
        // Then, a full recalc including all bonuses.
        updateAllCharacterSheetCalculations();
      });
    }
  });

  // Initial calculation for all skills and add event listeners
  // The initial skill calculation is now part of updateAllCharacterSheetCalculations.
  skillConfigs.forEach((skill) => {
    const ranksInput = document.getElementById(skill.ranksId);
    if (ranksInput) {
      ranksInput.addEventListener('input', () => {
        // When skill ranks change, only that skill and its dependencies need update.
        // However, for simplicity and to ensure bonus interactions, a full recalc might be easier.
        // For now, let's stick to targeted update for skill ranks.
        // updateSkillTotal(skill.ranksId, skill.abilityModId, skill.totalId);
        // OR, if complex interactions are expected:
        updateAllCharacterSheetCalculations(); // This ensures everything is up-to-date
      });
    }
  });
  
  // Event listeners for combat stats and saving throw base values
  // These should also trigger a full recalculation if they affect bases upon which bonuses apply.
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

  // Initial calculations are now part of updateAllCharacterSheetCalculations
  // updateCombatStats();
  // updateSavingThrows();
  
  // --- Basic Assertions for calculateAbilityModifier ---
  console.assert(calculateAbilityModifier(10) === 0, "Test Failed: Modifier for 10 should be 0");
  console.assert(calculateAbilityModifier(12) === 1, "Test Failed: Modifier for 12 should be 1");
  console.assert(calculateAbilityModifier(7) === -2, "Test Failed: Modifier for 7 should be -2");
  console.assert(calculateAbilityModifier(20) === 5, "Test Failed: Modifier for 20 should be 5");
  console.assert(calculateAbilityModifier(1) === -5, "Test Failed: Modifier for 1 should be -5");
  console.log("calculateAbilityModifier tests completed.");

  // Log initial calculated values for key fields
  // These will be logged after the first run of updateAllCharacterSheetCalculations
  // console.log("--- Initial Calculated Values ---");
  // ...

  // --- Custom Dice Rolls --- //
  const addCustomRollBtn = document.getElementById('addCustomRollBtn');
  const customRollFormContainer = document.getElementById('customRollFormContainer');
  const customRollsDisplayContainer = document.getElementById('customRollsDisplayContainer');
  let customRolls = []; // To store custom roll objects

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
        <div style="display: flex; flex-wrap: wrap;">`; // Wrapper for dice inputs

    const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
    diceTypes.forEach(die => {
        formHTML += `
            <div style="margin-right: 10px; margin-bottom: 5px; display: flex; align-items: center;">
                <label class="dice-label" for="${die}_count_temp" style="min-width: auto; margin-right: 3px;">${die}:</label>
                <input type="number" class="dice-input" data-die="${die}" name="${die}_count_temp" value="0" min="0" style="width: 45px;">
            </div>`;
    });
    formHTML += `</div>`; // End dice wrapper
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
                id: Date.now().toString(), // Simple unique ID
                description: description || "Custom Roll", // Default description if empty
                dice: diceCounts
            };

            customRolls.push(newRoll);
            renderCustomRolls(); // New function to re-render all displayed rolls
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
      customRollsDisplayContainer.innerHTML = ''; // Clear existing displayed rolls

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
          deleteBtn.style.marginLeft = '10px';
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


          rollDiv.appendChild(descriptionSpan);
          rollDiv.appendChild(diceSummarySpan);
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
          updateAllCharacterSheetCalculations(); // Recalculate after deleting a bonus
        }
      }
    });
  } else {
    console.error('Bonuses display container (bonusesDisplayContainer) not found for delete listener.');
  }

  renderBonuses();
  updateAllCharacterSheetCalculations(); // Initial full calculation
// feature/bonuses-section

  // Add event listeners to class skill checkboxes
  console.log('[DEBUG] Setting up event listeners for class skill checkboxes.');
  skillConfigs.forEach(skillConfig => {
    if (skillConfig.classSkillCheckboxId) { // Ensure the property exists
      const classSkillCheckbox = document.getElementById(skillConfig.classSkillCheckboxId);
      if (classSkillCheckbox) {
        classSkillCheckbox.addEventListener('change', () => {
          console.log(`[DEBUG] Class skill checkbox changed for: ${skillConfig.ranksId}`);
          // Call the master calculation function to update the specific skill and ensure sheet consistency
          updateAllCharacterSheetCalculations();
        });
      } else {
        console.warn(`Class skill checkbox not found for ID: ${skillConfig.classSkillCheckboxId}`);
      }
    } else {
      // This might occur if skillConfigs was not updated correctly, though previous steps indicate it was.
      console.warn(`classSkillCheckboxId missing in skillConfig for ranksId: ${skillConfig.ranksId}`);
    }
  });
  console.log('[DEBUG] Finished setting up event listeners for class skill checkboxes.');
  // Note: The final call to updateAllCharacterSheetCalculations() is already present above this block.
=======
// main
  // --- End Bonuses --- //
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
      updateAllCharacterSheetCalculations(); // Recalculate after adding a new bonus
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
    console.error('[DEBUG] Cancel Bonus button not found in new bonus form.'); // <-- ADD [DEBUG]
  }
}

function renderBonuses() {
  const displayContainer = document.getElementById('bonusesDisplayContainer');
  if (!displayContainer) {
    console.error('bonusesDisplayContainer not found for rendering');
    return;
  }
  displayContainer.innerHTML = ''; // Clear existing bonuses

  characterBonuses.forEach(bonus => {
    const bonusDiv = document.createElement('div');
    bonusDiv.classList.add('displayed-bonus');
    bonusDiv.dataset.bonusId = bonus.id;

    const summaryP = document.createElement('p');
    summaryP.classList.add('bonus-summary');
    // Format the value with a sign
    const valueString = bonus.value >= 0 ? `+${bonus.value}` : bonus.value.toString();
    summaryP.textContent = `Type: ${bonus.type} (${valueString})`; // <-- MODIFY THIS to include value

    const appliesToP = document.createElement('p');
    appliesToP.classList.add('bonus-applies-to');
    appliesToP.textContent = `Applies to: ${bonus.appliesTo.join(', ')}`;

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('bonus-description');
    descriptionP.textContent = bonus.description || '(No description)'; // Handle empty description

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-bonus-btn');
    deleteBtn.textContent = 'Delete';
    // No need to add event listener here, it's handled by delegation

    bonusDiv.appendChild(deleteBtn); // Add delete button first to float right
    bonusDiv.appendChild(summaryP);
    bonusDiv.appendChild(appliesToP);
    if (bonus.description) { // Only add description if it exists
        bonusDiv.appendChild(descriptionP);
    }

    displayContainer.appendChild(bonusDiv);
  });
}
