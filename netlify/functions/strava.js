exports.handler = async function(event) {
  const stravaPath = event.path.replace('/.netlify/functions/strava', '').replace('/api/strava', '');
  const query = event.queryStringParameters
    ? '?' + new URLSearchParams(event.queryStringParameters).toString()
    : '';

  const url = `https://www.strava.com/api/v3${stravaPath}${query}`;

  const authHeader = event.headers['authorization'] || event.headers['Authorization'];
  if (!authHeader) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No Authorization header' }) };
  }

  try {
    const response = await fetch(url, {
      method: event.httpMethod || 'GET',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' }
    });
    const data = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: data
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
