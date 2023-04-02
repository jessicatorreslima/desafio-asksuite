# Hotel Rooms Search API

## About

This API scrapes the website https://pratagy.letsbook.com.br/D/Reserva to search for prices of each room available during the check-in/check-out period provided in the POST request body.

* The default hotel used by the API is "PRATAGY BEACH RESORT ALL INCLUSIVE".
* The API searches for rooms for 2 adults by default.

## Technologies
* Node v18.15.0  

Dependencies: `express` `puppeteer` `dotenv`

## Setup

Before getting started, make sure that you have Node.js installed on your system. You can download it from the official website: https://nodejs.org/en/.

1. Clone the repository and move into the folder:
```
git clone https://github.com/jessicatorreslima/desafio-asksuit.git
```
```
cd desafio-asksuit
```

2. Install dependencies:
```
npm install
```

3. Start the server:
```
npm start
```

## Consuming the API

### Request
The default port is 8080.  
Send a POST request to the URL: http://localhost:8080/search with a JSON body as shown in the example below:

```JSON
{
    "checkin": "2021-07-01", 
    "checkout": "2021-07-05"
}
```
Dates <b>must</b> use the format: "YYYY-MM-DD"

### Response

The API returns an HTTP status code of 200 for successful requests and a JSON array with all rooms found, as shown in the example below:

```JSON
[
    {
        "name": "Studio Casal",
        "description": "No prédio principal do Resort, sem varanda e próximo à recepção. Dispõe de uma cama de casal e uma cama de solteiro. Acomoda até 2 pessoas. Sem cama extra. Inclui ingressos do Pratagy Acqua Park*. All inclusive com serviço de buffet.",
        "price": "R$  1.533,00",
        "image": "https://letsimage.s3.amazonaws.com/letsbook/193/quartos/30/fotoprincipal.jpg"
    },
    {
        "name": "Studio Familia",
        "description": "No prédio principal do Resort, com varanda e vista para os jardins. Dispõe de uma cama de casal e uma cama de solteiro. Acomoda até 3 pessoas, nas opções de 1 adulto e 2 crianças (free até 12 anos) ou 2 adultos e 1 criança (free até 12 anos) ou 3 adultos. Sem cama extra. Inclui ingressos do Pratagy Acqua Park*. All inclusive com serviço de buffet.",
        "price": "R$  1.686,00",
        "image": "https://letsimage.s3.amazonaws.com/letsbook/193/quartos/31/fotoprincipal.jpg"
    }
]
```  

If the API is unable to find any available rooms for the provided check-in/check-out period, it will return an HTTP status code of 400 along with an error message provided by the website, as shown in the example below:

```JSON
{
    "error": "Desculpe, mas não temos quartos disponíveis para esta data. Que tal tentar uma nova busca para um período diferente?"
}
```

<b>Note:</b> The API returns an HTTP status code of 400 for invalid requests.

<b>Note:</b> The website used by this API is not owned or maintained by the creator of this API. The creator of this API does not take responsibility for any changes or inconsistencies in the website that may cause this API to not work properly.