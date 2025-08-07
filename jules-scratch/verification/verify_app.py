from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # 1. Navigate to the application.
    page.goto("http://127.0.0.1:8080/index.html")

    # 2. Check that the main character sheet container is visible.
    sheet_container = page.locator("#sheet-container")
    expect(sheet_container).to_be_visible()

    # 3. Check that the character sheet management section is visible.
    character_sheet_management = page.locator("#character-sheet-management")
    expect(character_sheet_management).to_be_visible()

    # 4. Interact with the sheet to test responsiveness.
    # Change Strength score and check if the modifier updates.
    str_score_input = page.locator("#strScore")
    str_mod_span = page.locator("#strMod")

    # Initial check
    expect(str_score_input).to_have_value("10")
    expect(str_mod_span).to_have_text("0")

    # Change value
    str_score_input.fill("14")

    # Check if modifier updated
    expect(str_mod_span).to_have_text("2")

    # 5. Take a screenshot.
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
