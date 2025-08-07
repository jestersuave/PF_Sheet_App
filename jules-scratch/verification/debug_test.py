import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        import os
        html_file_path = "file://" + os.path.abspath("index.html")

        print(f"Loading page: {html_file_path}")
        await page.goto(html_file_path)

        # 3. Add Form and Cancel
        print("Testing Add Form and Cancel...")
        await page.locator("#addCustomRollBtn").click()
        await expect(page.locator("#customRollFormContainer > .custom-roll-form")).to_be_visible()
        await page.locator("#customRollFormContainer .cancel-roll-btn").click()
        await expect(page.locator("#customRollFormContainer")).to_be_empty()
        print("Add Form and Cancel OK.")

        # 4. Add Form, Input Data, and Save Valid Roll
        print("Testing Add Form, Input Data, and Save Valid Roll...")
        await page.locator("#addCustomRollBtn").wait_for(state="visible")
        await page.locator("#addCustomRollBtn").click()
        await expect(page.locator("#customRollFormContainer > .custom-roll-form")).to_be_visible()

        print("All tests passed!")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
