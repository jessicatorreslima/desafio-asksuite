const puppeteer = require('puppeteer');

class BrowserService {

    static getBrowser() {
        return puppeteer.launch({});
    }

    static closeBrowser(browser) {
        if (!browser) {
            return;
        }
        return browser.close();
    }
}

module.exports = BrowserService;
