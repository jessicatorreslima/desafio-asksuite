require('getmodule');
const express = require('express');
const router = express.Router();
const browserService = getmodule('services/BrowserService');

router.get('/', (req, res) => {
    res.send('Hello Asksuite World!');
});

//TODO implement endpoint here

router.post('/search', async (req, res) => {
    try {
        const request = req.body;

        // converte as datas para o formato necessário
        let checkin = new Date(request.checkin).toLocaleDateString("pt-BR", { timeZone: "UTC" });
        let checkout = new Date(request.checkout).toLocaleDateString("pt-BR", { timeZone: "UTC" });
        let current = new Date().toLocaleDateString("en-US", { timeZone: "UTC" });

        // encoda as datas para URI
        checkin = encodeURIComponent(checkin);
        checkout = encodeURIComponent(checkout);
        current = encodeURIComponent(current);

        // monta a url com as datas correspondentes
        const url = `https://pratagy.letsbook.com.br/D/Reserva?checkin=${checkin}&checkout=${checkout}
                        &cidade=&hotel=12&adultos=2&criancas=&destino=Pratagy+Beach+Resort+All+Inclusive
                        &promocode=&tarifa=&mesCalendario=${current}`;

        // carrega a página
        const browser = await browserService.getBrowser();
        const page = await browser.newPage();
        await page.goto(url);

        // captura as informações dos quartos
        const rooms = await page.$$eval('.row-quarto', (elements) => {
            return elements.map((element) => {
                const name = element.querySelector('.quartoNome').textContent.trim();
                const description = element.querySelector('.quartoDescricao').textContent.trim();
                const price = element.querySelector('.valorFinalDiscounted').textContent.trim();
                const image = element.querySelector('.slick-active').style.backgroundImage.slice(4, -1).replace(/["']/g, "");

                return { name, description, price, image };
            });
        });
        await browser.close();

        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;
