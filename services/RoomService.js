const BrowserService = require("./BrowserService");

class RoomService {
    /**
     * Converts the date to UTC format.
     * @param {string} format - The date format.
     * @param {Date} date - The date to be formatted. If not provided, uses the current date.
     * @returns {string} - The date formatted in UTC.
     */
    static formatDate(format, date = new Date()) {
        return date.toLocaleDateString(format, { timeZone: "UTC" });
    }

    /**
     * Builds the room search URL.
     * @param {string} checkin - The check-in date in "yyyy-mm-dd" format.
     * @param {string} checkout - The check-out date in "yyyy-mm-dd" format.
     * @returns {string} - The room search URL.
     */
    static buildUrl(checkin, checkout) {
        const baseUrl = "https://pratagy.letsbook.com.br/D/Reserva";
        const currentDate = this.formatDate("en-US");
        const formattedCheckin = this.formatDate("pt-BR", new Date(checkin));
        const formattedCheckout = this.formatDate("pt-BR", new Date(checkout));
        const query = `?checkin=${encodeURIComponent(formattedCheckin)}&checkout=${encodeURIComponent(formattedCheckout)}&cidade=&hotel=12&adultos=2&criancas=&destino=Pratagy+Beach+Resort+All+Inclusive&promocode=&tarifa=&mesCalendario=${encodeURIComponent(currentDate)}`;
        return `${baseUrl}${query}`;
    }

    /**
     * Searches for available rooms.
     * @param {string} checkin - The check-in date in "yyyy-mm-dd" format.
     * @param {string} checkout - The check-out date in "yyyy-mm-dd" format.
     * @returns {Array} - An array of objects containing information about the available rooms.
     */
    static async getRooms(checkin, checkout) {
        const url = this.buildUrl(checkin, checkout);
        const browser = await BrowserService.getBrowser();
        try {
            const page = await browser.newPage();
            await page.goto(url);
            // Checks for unavailability errors
            const unavailability = await this.getUnavailability(page);
            if (unavailability) {
                return ({ error: unavailability });
            }

            const rooms = await this.extractRooms(page);
            return rooms;
        } finally {
            await BrowserService.closeBrowser(browser);
        }
    }

    /**
     * Extracts information about the rooms from the search page.
     * @param {Page} page - The puppeteer Page object representing the page to search.
     * @returns {Array} - An array of objects containing information about the available rooms.
     */
    static async extractRooms(page) {
        const rooms = page.$$eval(".row-quarto", (elements) =>
            elements.map((element) => {
                const name = element.querySelector(".quartoNome").textContent.trim();
                const description = element.querySelector(".quartoDescricao").textContent.trim();
                const price = element.querySelector(".valorFinalDiscounted").textContent.trim();
                const image = element.querySelector(".slick-active").style.backgroundImage.slice(4, -1).replace(/["']/g, "");

                return { name, description, price, image };
            })
        );
        return rooms;
    }

    /**
     * Retrieves the unavailability mesage from the search page.
     * @param {Page} page - The puppeteer Page object representing the page to search.
     * @returns {string} - The unavailability mesage, or an empty string if the element is not found.
     */
    static async getUnavailability(page) {
        const selector = '.hotel-selecionado-indisponivel-titulo';
        let text = '';
        try {
            await page.waitForSelector(selector);
            text = await page.$eval(selector, element => element.textContent.trim());
        } finally {
            return text;
        }
    }
}

module.exports = RoomService;
