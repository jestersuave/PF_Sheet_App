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
  { ranksId: 'acrobaticsRanks', abilityModId: 'dexMod', totalId: 'acrobaticsTotal' },
  { ranksId: 'appraiseRanks', abilityModId: 'intMod', totalId: 'appraiseTotal' },
  { ranksId: 'bluffRanks', abilityModId: 'chaMod', totalId: 'bluffTotal' },
  { ranksId: 'climbRanks', abilityModId: 'strMod', totalId: 'climbTotal' },
  { ranksId: 'craftRanks', abilityModId: 'intMod', totalId: 'craftTotal' },
  { ranksId: 'diplomacyRanks', abilityModId: 'chaMod', totalId: 'diplomacyTotal' },
  { ranksId: 'disableDeviceRanks', abilityModId: 'dexMod', totalId: 'disableDeviceTotal' },
  { ranksId: 'disguiseRanks', abilityModId: 'chaMod', totalId: 'disguiseTotal' },
  { ranksId: 'escapeArtistRanks', abilityModId: 'dexMod', totalId: 'escapeArtistTotal' },
  { ranksId: 'flyRanks', abilityModId: 'dexMod', totalId: 'flyTotal' },
  { ranksId: 'handleAnimalRanks', abilityModId: 'chaMod', totalId: 'handleAnimalTotal' },
  { ranksId: 'healRanks', abilityModId: 'wisMod', totalId: 'healTotal' },
  { ranksId: 'intimidateRanks', abilityModId: 'chaMod', totalId: 'intimidateTotal' },
  { ranksId: 'knowledgeArcanaRanks', abilityModId: 'intMod', totalId: 'knowledgeArcanaTotal' },
  { ranksId: 'knowledgeDungeoneeringRanks', abilityModId: 'intMod', totalId: 'knowledgeDungeoneeringTotal' },
  { ranksId: 'knowledgeEngineeringRanks', abilityModId: 'intMod', totalId: 'knowledgeEngineeringTotal' },
  { ranksId: 'knowledgeGeographyRanks', abilityModId: 'intMod', totalId: 'knowledgeGeographyTotal' },
  { ranksId: 'knowledgeHistoryRanks', abilityModId: 'intMod', totalId: 'knowledgeHistoryTotal' },
  { ranksId: 'knowledgeLocalRanks', abilityModId: 'intMod', totalId: 'knowledgeLocalTotal' },
  { ranksId: 'knowledgeNatureRanks', abilityModId: 'intMod', totalId: 'knowledgeNatureTotal' },
  { ranksId: 'knowledgeNobilityRanks', abilityModId: 'intMod', totalId: 'knowledgeNobilityTotal' },
  { ranksId: 'knowledgePlanesRanks', abilityModId: 'intMod', totalId: 'knowledgePlanesTotal' },
  { ranksId: 'knowledgeReligionRanks', abilityModId: 'intMod', totalId: 'knowledgeReligionTotal' },
  { ranksId: 'linguisticsRanks', abilityModId: 'intMod', totalId: 'linguisticsTotal' },
  { ranksId: 'perceptionRanks', abilityModId: 'wisMod', totalId: 'perceptionTotal' },
  { ranksId: 'performRanks', abilityModId: 'chaMod', totalId: 'performTotal' },
  { ranksId: 'professionRanks', abilityModId: 'wisMod', totalId: 'professionTotal' },
  { ranksId: 'rideRanks', abilityModId: 'dexMod', totalId: 'rideTotal' },
  { ranksId: 'senseMotiveRanks', abilityModId: 'wisMod', totalId: 'senseMotiveTotal' },
  { ranksId: 'sleightOfHandRanks', abilityModId: 'dexMod', totalId: 'sleightOfHandTotal' },
  { ranksId: 'spellcraftRanks', abilityModId: 'intMod', totalId: 'spellcraftTotal' },
  { ranksId: 'stealthRanks', abilityModId: 'dexMod', totalId: 'stealthTotal' },
  { ranksId: 'survivalRanks', abilityModId: 'wisMod', totalId: 'survivalTotal' },
  { ranksId: 'swimRanks', abilityModId: 'strMod', totalId: 'swimTotal' },
  { ranksId: 'useMagicDeviceRanks', abilityModId: 'chaMod', totalId: 'useMagicDeviceTotal' }
];

function updateSkillTotal(skillRanksId, abilityModifierId, skillTotalId) {
  const ranks = getIntValue(skillRanksId);
  const abilityModifier = getIntValue(abilityModifierId);
  const totalSpan = document.getElementById(skillTotalId);

  if (totalSpan) {
    totalSpan.textContent = ranks + abilityModifier;
  } else {
    console.error(`Skill total span not found: ${skillTotalId}`);
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
  const armorBonus = getIntValue('armorBonus');
  const shieldBonus = getIntValue('shieldBonus');
  const sizeModAc = getIntValue('sizeModAc');
  const naturalArmor = getIntValue('naturalArmor');
  const deflectionMod = getIntValue('deflectionMod');
  const miscAcBonus = getIntValue('miscAcBonus');
  const bab = getIntValue('bab');
  const sizeModAttack = getIntValue('sizeModAttack');
  const initiativeMiscMod = getIntValue('initiativeMiscMod');

  document.getElementById('hpTotal').textContent = hpBase + conMod;
  document.getElementById('acTotal').textContent = 10 + dexMod + armorBonus + shieldBonus + sizeModAc + naturalArmor + deflectionMod + miscAcBonus;
  document.getElementById('meleeAttack').textContent = bab + strMod + sizeModAttack;
  document.getElementById('rangedAttack').textContent = bab + dexMod + sizeModAttack;
  document.getElementById('cmbTotal').textContent = bab + strMod + sizeModAttack;
  document.getElementById('cmdTotal').textContent = 10 + bab + strMod + dexMod + sizeModAttack;
  document.getElementById('initiativeTotal').textContent = dexMod + initiativeMiscMod;
}

// --- Saving Throws ---
function updateSavingThrows() {
  const conMod = getIntValue('conMod');
  const dexMod = getIntValue('dexMod');
  const wisMod = getIntValue('wisMod');

  const fortBase = getIntValue('fortBase');
  const fortMagicMod = getIntValue('fortMagicMod');
  const fortMiscMod = getIntValue('fortMiscMod');
  document.getElementById('fortTotal').textContent = fortBase + conMod + fortMagicMod + fortMiscMod;

  const refBase = getIntValue('refBase');
  const refMagicMod = getIntValue('refMagicMod');
  const refMiscMod = getIntValue('refMiscMod');
  document.getElementById('refTotal').textContent = refBase + dexMod + refMagicMod + refMiscMod;

  const willBase = getIntValue('willBase');
  const willMagicMod = getIntValue('willMagicMod');
  const willMiscMod = getIntValue('willMiscMod');
  document.getElementById('willTotal').textContent = willBase + wisMod + willMagicMod + willMiscMod;
}


// --- Event Listeners & Initial Calculation ---
document.addEventListener('DOMContentLoaded', () => {
  // Initial calculation for ability scores
  abilityScoreConfigs.forEach(ability => {
    updateAbilityModifierDisplay(ability.scoreId, ability.modId);
    updateDependentSkills(ability.modId);
  });

  // Add event listeners to ability score inputs
  abilityScoreConfigs.forEach(ability => {
    const scoreInput = document.getElementById(ability.scoreId);
    if (scoreInput) {
      scoreInput.addEventListener('input', () => {
        updateAbilityModifierDisplay(ability.scoreId, ability.modId);
        updateDependentSkills(ability.modId);
        updateCombatStats(); 
        updateSavingThrows();
      });
    }
  });

  // Initial calculation for all skills and add event listeners
  skillConfigs.forEach((skill, index) => {
    updateSkillTotal(skill.ranksId, skill.abilityModId, skill.totalId);
    const ranksInput = document.getElementById(skill.ranksId);
    if (ranksInput) {
      ranksInput.addEventListener('input', () => {
        updateSkillTotal(skill.ranksId, skill.abilityModId, skill.totalId);
      });
    }
    // Log first skill calculation for basic feedback
    if (index === 0) {
        console.log("Initial skill test (Acrobatics): Ranks=" + getIntValue('acrobaticsRanks') + ", Mod=" + getIntValue('dexMod') + ", Total=" + getIntValue('acrobaticsTotal'));
    }
  });
  
  // Combat stats input fields
  const combatInputIds = [
    'hpBase', 'armorBonus', 'shieldBonus', 'sizeModAc', 'naturalArmor', 
    'deflectionMod', 'miscAcBonus', 'bab', 'sizeModAttack', 'initiativeMiscMod'
  ];
  combatInputIds.forEach(inputId => {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.addEventListener('input', updateCombatStats);
    }
  });

  // Saving throw input fields
  const savingThrowInputIds = [
    'fortBase', 'fortMagicMod', 'fortMiscMod',
    'refBase', 'refMagicMod', 'refMiscMod',
    'willBase', 'willMagicMod', 'willMiscMod'
  ];
  savingThrowInputIds.forEach(inputId => {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.addEventListener('input', updateSavingThrows);
    }
  });

  // Initial calculations
  updateCombatStats();
  updateSavingThrows(); 
  
  // --- Basic Assertions for calculateAbilityModifier ---
  console.assert(calculateAbilityModifier(10) === 0, "Test Failed: Modifier for 10 should be 0");
  console.assert(calculateAbilityModifier(12) === 1, "Test Failed: Modifier for 12 should be 1");
  console.assert(calculateAbilityModifier(7) === -2, "Test Failed: Modifier for 7 should be -2");
  console.assert(calculateAbilityModifier(20) === 5, "Test Failed: Modifier for 20 should be 5");
  console.assert(calculateAbilityModifier(1) === -5, "Test Failed: Modifier for 1 should be -5");
  console.log("calculateAbilityModifier tests completed.");

  // Log initial calculated values for key fields
  console.log("--- Initial Calculated Values ---");
  console.log("Strength Modifier (strMod): " + getIntValue('strMod'));
  console.log("Acrobatics Total (acrobaticsTotal): " + getIntValue('acrobaticsTotal'));
  console.log("HP Total (hpTotal): " + getIntValue('hpTotal'));
  console.log("AC Total (acTotal): " + getIntValue('acTotal'));
  console.log("Fortitude Total (fortTotal): " + getIntValue('fortTotal'));
  console.log("---------------------------------");

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

          // Future: Add edit/delete buttons here if needed
          // For now, just display. A delete button is a good next step.
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.style.marginLeft = '10px';
          deleteBtn.style.padding = '3px 8px';
          deleteBtn.style.backgroundColor = '#dc3545'; // Red color for delete
          deleteBtn.style.color = 'white';
          deleteBtn.style.border = 'none';
          deleteBtn.style.borderRadius = '3px';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.addEventListener('click', function() {
              customRolls = customRolls.filter(r => r.id !== roll.id);
              renderCustomRolls(); // Re-render after deletion
          });


          rollDiv.appendChild(descriptionSpan);
          rollDiv.appendChild(diceSummarySpan);
          rollDiv.appendChild(deleteBtn); // Add delete button
          customRollsDisplayContainer.appendChild(rollDiv);
      });
  }

  if (addCustomRollBtn) {
    addCustomRollBtn.addEventListener('click', createNewRollForm);
  } else {
    console.error('Main "Add Custom Roll" button (addCustomRollBtn) not found.');
  }
  renderCustomRolls(); // Initial render (will be empty at first)
  // --- End Custom Dice Rolls --- //
});
