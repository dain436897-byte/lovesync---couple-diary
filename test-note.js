import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Log console messages
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure().errorText));

    await page.goto('http://localhost:3000');
    
    // Login
    await page.waitForSelector('input[type="text"]');
    await page.type('input[type="text"]', 'MLynkXynh');
    await page.type('input[type="password"]', 'Matkhau1@23!');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForTimeout(2000);
    
    // Check if we are logged in
    const title = await page.content();
    if (title.includes('Khoảnh khắc ngọt ngào')) {
        console.log("Logged in!");
    } else {
        console.log("Failed to login or title not found.");
    }

    await browser.close();
})();
