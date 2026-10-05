const MAPBOX_TOKEN = 'pk.eyJ1IjoibG9ycnNncyIsImEiOiJjbXV1azY4emsxamhkMnhxNHhhZzBwbG1nIn0.VksNkhbqWAzCgWWxwHhIWw';

// Destino Fixo: Exemplo - Museu do Amanhã, Rio de Janeiro [Longitude, Latitude]
const DESTINO_FIXO = [-43.1794, -22.8964]; 

/**
 * 1. Converte o texto digitado no formulário em coordenadas [lon, lat]
 */
async function obterCoordenadasPorTexto(enderecoTexto) {
  // encodeURIComponent garante que espaços e acentos não quebrem a URL
  const enderecoEncoded = encodeURIComponent(enderecoTexto);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${enderecoEncoded}.json?limit=1&access_token=${MAPBOX_TOKEN}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.features || data.features.length === 0) {
    throw new Error('Endereço não encontrado. Tente detalhar melhor o local.');
  }

  // O Mapbox retorna o ponto geográfico no formato [longitude, latitude]
  return data.features[0].center; 
}

/**
 * 2. Calcula a distância por rota entre a origem encontrada e o destino fixo
 */
async function calcularDistanciaAteDestinoFixo(enderecoOrigemTexto) {
  try {
    // Passo 1: Transformar texto da origem em [lon, lat]
    const origemCoords = await obterCoordenadasPorTexto(enderecoOrigemTexto);
    const [origLon, origLat] = origemCoords;

    const [destLon, destLat] = DESTINO_FIXO;

    // Passo 2: Fazer a chamada à Directions API
    const urlDirections = `https://api.mapbox.com/directions/v5/mapbox/driving/${origLon},${origLat};${destLon},${destLat}?overview=false&access_token=${MAPBOX_TOKEN}`;

    const response = await fetch(urlDirections);
    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes.length) {
      throw new Error('Não foi possível calcular uma rota entre esses pontos.');
    }

    const rota = data.routes[0];
    const distanciaKm = (rota.distance / 1000).toFixed(2);
    const duracaoMinutos = Math.round(rota.duration / 60);

    return {
      origemFormatada: enderecoOrigemTexto,
      distanciaKm: Number(distanciaKm),
      duracaoMinutos: duracaoMinutos
    };

  } catch (error) {
    console.error('Erro no cálculo:', error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// Exemplo de integração com um formulário HTML simples
// -------------------------------------------------------------
/*
  HTML necessário:
  <input type="text" id="campoOrigem" placeholder="Digite o ponto de partida...">
  <button id="btnCalcular">Calcular Distância</button>
  <div id="resultado"></div>
*/

document.getElementById('btnCalcular').addEventListener('click', async () => {
  const inputOrigem = document.getElementById('campoOrigem').value;
  const divResultado = document.getElementById('resultado');

  if (!inputOrigem.trim()) {
    divResultado.innerText = 'Por favor, digite um local de origem.';
    return;
  }

  divResultado.innerText = 'Calculando rota...';

  try {
    const res = await calcularDistanciaAteDestinoFixo(inputOrigem);
    divResultado.innerHTML = `
      <p><strong>Distância:</strong> ${res.distanciaKm} km</p>
      <p><strong>Tempo estimado de carro:</strong> ${res.duracaoMinutos} min</p>
    `;
  } catch (err) {
    divResultado.innerText = err.message;
  }
});