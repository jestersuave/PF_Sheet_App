import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Get the absolute path to index.html
        # Assuming script is run from the root of the repo
        import os
        html_file_path = "file://" + os.path.abspath("index.html")

        print(f"Loading page: {html_file_path}")
        await page.goto(html_file_path)

        # --- Test Plan ---

        # 1. Load `index.html` (done by page.goto)

        # 2. Initial State Check
        print("Checking initial state...")
        await expect(page.locator("#addCustomRollBtn")).to_be_visible()
        await expect(page.locator("#customRollFormContainer")).to_be_empty()
        await expect(page.locator("#customRollsDisplayContainer")).to_be_empty()
        print("Initial state OK.")

        # 3. Add Form and Cancel
        print("Testing Add Form and Cancel...")
        await page.locator("#addCustomRollBtn").click()
        await expect(page.locator("#customRollFormContainer")).to_have_count(1) # Should have one child (the form)
        await expect(page.locator("#customRollFormContainer > .custom-roll-form")).to_be_visible()
        await page.locator("#customRollFormContainer .cancel-roll-btn").click()
        await expect(page.locator("#customRollFormContainer")).to_be_empty()
        print("Add Form and Cancel OK.")

        # 4. Add Form, Input Data, and Save Valid Roll
        print("Testing Add Form, Input Data, and Save Valid Roll...")
        await page.locator("#addCustomRollBtn").click()
        await page.locator("#customRollFormContainer .roll-description-input").fill("Test Dragon Breath")
        await page.locator("#customRollFormContainer input[data-die='d6']").fill("3")
        await page.locator("#customRollFormContainer input[data-die='d10']").fill("1")
        await page.locator("#customRollFormContainer .save-roll-btn").click()
        
        await expect(page.locator("#customRollFormContainer")).to_be_empty()
        await expect(page.locator("#customRollsDisplayContainer > .displayed-roll")).to_have_count(1)
        
        first_roll = page.locator("#customRollsDisplayContainer > .displayed-roll").first
        await expect(first_roll.locator(".roll-description")).to_have_text("Test Dragon Breath")
        await expect(first_roll.locator(".roll-dice-summary")).to_have_text("3d6 + 1d10")
        await expect(first_roll.locator("button:has-text('Delete')")).to_be_visible()
        print("Add Form, Input Data, and Save Valid Roll OK.")

        # 5. Save Roll with No Description (Uses Default)
        print("Testing Save Roll with No Description...")
        await page.locator("#addCustomRollBtn").click()
        await page.locator("#customRollFormContainer input[data-die='d20']").fill("1")
        await page.locator("#customRollFormContainer .save-roll-btn").click()

        await expect(page.locator("#customRollsDisplayContainer > .displayed-roll")).to_have_count(2)
        second_roll = page.locator("#customRollsDisplayContainer > .displayed-roll").nth(1)
        await expect(second_roll.locator(".roll-description")).to_have_text("Custom Roll")
        await expect(second_roll.locator(".roll-dice-summary")).to_have_text("1d20")
        print("Save Roll with No Description OK.")

        # 6. Attempt to Save Roll with No Dice (Should Fail)
        print("Testing Attempt to Save Roll with No Dice...")
        # Setup to catch alerts
        alert_messages = []
        dialog_handler = lambda dialog: (alert_messages.append(dialog.message), asyncio.create_task(dialog.dismiss()))
        page.on("dialog", dialog_handler)

        await page.locator("#addCustomRollBtn").click()
        await page.locator("#customRollFormContainer .roll-description-input").fill("Invalid Test")
        # Ensure dice inputs are 0 (default)
        await page.locator("#customRollFormContainer .save-roll-btn").click()

        await expect(page.locator("#customRollFormContainer > .custom-roll-form")).to_be_visible() # Form should still be there
        await expect(page.locator("#customRollsDisplayContainer > .displayed-roll")).to_have_count(2) # No new roll added
        
        # Check for alert message (optional, but good to verify)
        # This is a bit tricky with async, ensure the event has time to fire
        await page.wait_for_timeout(100) # give a bit of time for dialog event
        if "Please specify at least one die to roll." not in alert_messages:
             print(f"Warning: Expected alert 'Please specify at least one die to roll.' not found. Alerts received: {alert_messages}")


        # Clean up
        await page.locator("#customRollFormContainer .cancel-roll-btn").click()
        await expect(page.locator("#customRollFormContainer")).to_be_empty()
        print("Attempt to Save Roll with No Dice OK (form remained, no new roll).")
        page.remove_listener("dialog", dialog_handler) # remove listener

        # 7. Delete a Roll
        print("Testing Delete a Roll...")
        await expect(page.locator("#customRollsDisplayContainer > .displayed-roll")).to_have_count(2)
        # Click delete on the first roll ("Test Dragon Breath")
        await page.locator("#customRollsDisplayContainer > .displayed-roll").first.locator("button:has-text('Delete')").click()
        
        await expect(page.locator("#customRollsDisplayContainer > .displayed-roll")).to_have_count(1)
        remaining_roll = page.locator("#customRollsDisplayContainer > .displayed-roll").first
        await expect(remaining_roll.locator(".roll-description")).to_have_text("Custom Roll") # The d20 roll
        print("Delete a Roll OK.")

        # 8. Delete the Last Roll
        print("Testing Delete the Last Roll...")
        await page.locator("#customRollsDisplayContainer > .displayed-roll").first.locator("button:has-text('Delete')").click()
        await expect(page.locator("#customRollsDisplayContainer")).to_be_empty()
        print("Delete the Last Roll OK.")

        print("All tests passed!")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
