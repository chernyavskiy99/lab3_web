var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="normalize.css" rel="stylesheet">
  <link href="css/style.css" rel="stylesheet">
  <link href="favicon.ico" rel="icon">
  <title>Weather WIP</title>
</head>
<body>
  <main class="container">
    <h1 class="visually-hidden">Прогноз погоды</h1>

    <section class="local">
      <div class="local__refresh refresh">
        <h2 class="refresh__heading">Погода здесь</h2>
        <button class="refresh__button refresh__button-text" type="button">Обновить геолокацию</button>
      </div>
      
      <b>Loading...</b>
    </section>

    <section class="favorites">  
      <div class="favorites__header">
        <h2 class="favorites__heading">Избранное</h2>
        <form class="favorites__add">
          <input type="text" class="favorites__input" placeholder="Добавить новый город">
          <button class="favorites__add-button" type="submit"><span class="visually-hidden">Добавить новый город</span></button>
        </form>
      </div>
      
      <ul class="favorites__list list-style-reset">
        <b>Loading...</b>
      </ul>
    </section>
  </main>

  <template id="refresh">
    
  </template>

  <template id="local-general">
    <div class="local__info local-weather">
      <div class="local-weather__general">
        <h3 class="local-weather__city"></h3>
        <p class="local-weather__short-info">
          <span class="local-weather__icon-wrap">
            <img class="local-weather__icon" src="" alt="" width="75" height="75">
          </span>
          <span class="local-weather__degrees"></span>
        </p>
      </div>
    </div>    
  </template>

  <template id="weather-details">
    <ul class="local-weather__details weather-details list-style-reset">
      <li class="weather-details__item">
        <span class="weather-details__property">Ветер</span>
        <span class="weather-details__value"></span>
      </li>

      <li class="weather-details__item">
        <span class="weather-details__property">Облачность</span>
        <span class="weather-details__value"></span>
      </li>

      <li class="weather-details__item">
        <span class="weather-details__property">Давление</span>
        <span class="weather-details__value"></span>
      </li>

      <li class="weather-details__item">
        <span class="weather-details__property">Влажность</span>
        <span class="weather-details__value"></span>
      </li>

      <li class="weather-details__item">
        <span class="weather-details__property">Координаты</span>
        <span class="weather-details__value"></span>
      </li>
    </ul>
  </template>

  <template id="favorites-item">
    <li class="favorites__item favorite-item">
      <div class="favorite-item__general">
        <h3 class="favorite-item__city"></h3>
        <p class="favorite-item__short-info">
          <span class="favorite-item__degrees"></span>
          <img class="favorite-item__icon" src="" alt="" width="30" height="30">
        </p>
        <button class="favorite-item__button"><span class="visually-hidden">Удалить город</span></button>
      </div>
    </li>
  </template>

  <script src="../js/main.js"></script>
</body>
</html>`
window = new JSDOM(html).window;
global.document = window.document;
global.window = window;
global.fetch = require("node-fetch");
global.navigator = {
    userAgent: 'node.js'
};
const geolocate = require('mock-geolocation');
geolocate.use();
const fetchMock = require('fetch-mock');
const expect = require('chai').expect;
const sinon = require("sinon");
const script = require('../js/main');

const baseURL = 'https://web-lab2-bgubanov.herokuapp.com';

mockCity = {
    coord: {lon: 30.26, lat: 59.89},
    sys: {country: "RU", timezone: 10800, sunrise: 1608447573, sunset: 1608468828},
    weather: [{id: 300, main: "Drizzle", description: "небольшая морось", icon: "09n"}],
    main: {
        temp: 1.69,
        feels_like: -2.29,
        temp_min: 1.11,
        temp_max: 2.22,
        pressure: 1023,
        humidity: 93
    },
    visibility: 6000,
    wind: {speed: 3, deg: 240},
    clouds: {all: 90},
    dt: 1608484148,
    id: 498817,
    name: "Saint Petersburg"
};

mainSection = `<h3 class="local-weather__city">Saint Petersburg</h3>
		    <p class="local-weather__short-info">
		     <span class="local-weather__icon-wrap">
		      <img class="local-weather__icon" src="http://openweathermap.org/img/wn/09n@2x.png" alt="небольшая морось" width="75" height="75">
		       </span>
		        <span class="local-weather__degrees">2°C</span>
		         </p>`.replace(/\s+/g, ' ');

info = `<li class="weather-details__item">
  <span class="weather-details__property">Ветер</span>
   <span class="weather-details__value">3 m/s, North-northeast</span>
    </li>
     <li class="weather-details__item">
      <span class="weather-details__property">Облачность</span>
       <span class="weather-details__value">90 %</span>
        </li>
         <li class="weather-details__item">
          <span class="weather-details__property">Давление</span>
           <span class="weather-details__value">1023 hpa</span>
            </li> <li class="weather-details__item">
             <span class="weather-details__property">Влажность</span>
              <span class="weather-details__value">93 %</span>
               </li> <li class="weather-details__item">
                <span class="weather-details__property">Координаты</span>
                 <span class="weather-details__value">[59.89, 30.26]</span>
                  </li>`.replace(/\s+/g, ' ');

errorSection = `<p class="wait">О нет, что-то пошло не так</p>`.replace(/\s+/g, ' ');

favouriteCitySection = `<li class="favorites__item favorite-item">
  <div class="favorite-item__general">
   <h3 class="favorite-item__city">Saint Petersburg</h3>
    <p class="favorite-item__short-info">
     <span class="favorite-item__degrees">2°C</span>
      <img class="favorite-item__icon" src="http://openweathermap.org/img/wn/09n@2x.png" alt="небольшая морось" width="30" height="30">
       </p>
        <button class="favorite-item__button" data-id="498817"><span class="visually-hidden">Удалить город</span></button>
         </div>
          <ul class="local-weather__details weather-details list-style-reset">
           <li class="weather-details__item">
            <span class="weather-details__property">Ветер</span>
             <span class="weather-details__value">3 m/s, North-northeast</span>
              </li> <li class="weather-details__item">
               <span class="weather-details__property">Облачность</span>
                <span class="weather-details__value">90 %</span>
                 </li> <li class="weather-details__item">
                  <span class="weather-details__property">Давление</span>
                   <span class="weather-details__value">1023 hpa</span>
                    </li> <li class="weather-details__item">
                     <span class="weather-details__property">Влажность</span>
                      <span class="weather-details__value">93 %</span>
                       </li> <li class="weather-details__item">
                        <span class="weather-details__property">Координаты</span>
                         <span class="weather-details__value">[59.89, 30.26]</span>
                          </li> </ul></li>`.replace(/\s+/g, ' ')

citySection = `
		<div class="city-weather">
		<h3>Saint-Petersburg</h3>
		<p class="city-temp">10°</p>
		<img class="city-weather-img" src="https://openweathermap.org/img/wn/50n@2x.png">
		<button class="circle-btn"></button>
		</div>
		<div class="info">`.replace(/\s+/g, ' ')

errorSectionCity = `<p class="wait-city">О нет, что-то пошло не так</p>`.replace(/\s+/g, ' ').trim();

favouriteCitiesResponse = {
    "cnt": 1,
    "list": [mockCity]
}

describe('CLIENT: load main city', () => {

    it('load main city by position', (done) => {
        fetchMock.get(`${baseURL}/weather/coordinates?lat=1&lon=2`, mockCity);
        script.getMainCity(() => {
            expect(document.querySelector('.local-weather__general').innerHTML.replace(/\s+/g, ' ').trim()).to.equal(mainSection);
            expect(document.querySelector('.local-weather__details').innerHTML.replace(/\s+/g, ' ').trim()).to.equal(info)
            fetchMock.done();
            fetchMock.restore();
            done();
        });
        geolocate.send({latitude: 1, longitude: 2});
    })

    it('load default main city', (done) => {
        fetchMock.get(`${baseURL}/weather/coordinates?lat=59.9344574&lon=30.2441396`, mockCity);
        script.getMainCity(() => {
            expect(document.querySelector('.local-weather__general').innerHTML.replace(/\s+/g, ' ').trim()).to.equal(mainSection);
            expect(document.querySelector('.local-weather__details').innerHTML.replace(/\s+/g, ' ').trim()).to.equal(info)
            fetchMock.done();
            fetchMock.restore();
            done();
        });
        geolocate.sendError({code: 1, message: "DENIED"});
    })
})

describe('CLIENT: add favourite city', () => {

    afterEach(() => {
        window = new JSDOM(html).window;
        global.document = window.document;
        global.window = window;
    })

    it('add city with ok response from server', (done) => {
        cityInput = 'Saint-Petersburg';
        fetchMock.get(`${baseURL}/weather/city?q=${cityInput.trim()}`, mockCity);
        script.addNewFavouriteCity(cityInput, () => {
            expect(document.querySelector('.favorites__list').innerHTML.replace(/\s+/g, ' ').trim()).to.equal(favouriteCitySection);
            fetchMock.done();
            fetchMock.restore();
            done();
        });
    })
})

describe('CLIENT: get favourites cities', () => {
    afterEach(() => {
        window = new JSDOM(html).window;
        global.document = window.document;
        global.window = window;
    })

    it('get cities ok response from server', (done) => {
        cityInput = 'Saint-Petersburg';
        fetchMock.get(`${baseURL}/favourites`, favouriteCitiesResponse);
        script.getFavouriteCities(() => {
            expect(document.querySelector('.favorites__list').innerHTML.replace(/\s+/g, ' ').trim()).to.equal(favouriteCitySection);
            fetchMock.done();
            fetchMock.restore();
            done();
        });
    })
})