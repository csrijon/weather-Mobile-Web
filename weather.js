const HOST = 'https://api.weatherapi.com';
const API_KEY = '9194d8cdbcf44dcea0a91415240808';

async function fetchWeatherHistory(name, start, end) {
    const resp = await fetch(`${HOST}/v1/history.json?key=${API_KEY}&q=${name}&dt=${start}&end_dt=${end}`);
    return await resp.json();
}

async function fetchCurrentWeatherByCity(name) {
    const resp = await fetch(`${HOST}/v1/current.json?key=${API_KEY}&q=${name}`);
    return await resp.json();
}
