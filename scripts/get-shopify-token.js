const http = require('http');
const url = require('url');
const https = require('https');

// Configurações do app
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const SHOP = 'your-store.myshopify.com';
const REDIRECT_URI = 'http://localhost:3000/callback';
const SCOPES = 'read_products,write_products,read_orders,read_customers,write_customers,read_discounts,write_discounts,read_draft_orders,write_draft_orders';

console.log('\n🚀 Servidor OAuth iniciado!\n');
console.log('📋 Passo 1: Abra esta URL no navegador:\n');
console.log(`https://${SHOP}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}&state=antigravity\n`);

const server = http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;

  if (req.url.startsWith('/callback')) {
    const code = queryObject.code;
    const hmac = queryObject.hmac;
    const shop = queryObject.shop || SHOP;

    // Se recebeu hmac mas não code, é o fluxo de instalação
    if (hmac && !code) {
      console.log('⚠️  Recebido callback de instalação (hmac), mas precisamos do código OAuth.\n');
      console.log('📋 Por favor, abra esta URL para obter o código de autorização:\n');
      const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}&state=antigravity`;
      console.log(authUrl + '\n');

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head>
            <style>
              body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
              .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 5px; }
              .url { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; font-family: monospace; word-break: break-all; }
              a { color: #007bff; }
            </style>
          </head>
          <body>
            <div class="warning">
              <h1>⚠️ Callback de Instalação Recebido</h1>
              <p>Você foi redirecionado após instalar o app, mas ainda precisamos autorizar o acesso.</p>
              <p><strong>Clique no link abaixo para autorizar:</strong></p>
              <div class="url">
                <a href="${authUrl}" target="_blank">${authUrl}</a>
              </div>
            </div>
          </body>
        </html>
      `);
      return;
    }

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>❌ Erro: Código de autorização não encontrado</h1><p>Parâmetros recebidos: ' + JSON.stringify(queryObject) + '</p>');
      return;
    }

    console.log('✅ Código de autorização recebido!');
    console.log('🔄 Trocando código por token de acesso...\n');

    // Trocar código por token
    const postData = JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code
    });

    const options = {
      hostname: shop,
      path: '/admin/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const tokenReq = https.request(options, (tokenRes) => {
      let data = '';

      tokenRes.on('data', (chunk) => {
        data += chunk;
      });

      tokenRes.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.access_token) {
            console.log('🎉 TOKEN OBTIDO COM SUCESSO!\n');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📝 COPIE ESTAS INFORMAÇÕES:\n');
            console.log(`MYSHOPIFY_DOMAIN: "${shop}"`);
            console.log(`SHOPIFY_ACCESS_TOKEN: "${response.access_token}"`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <head>
                  <style>
                    body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
                    .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; }
                    .token { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; font-family: monospace; word-break: break-all; }
                    h1 { color: #155724; }
                  </style>
                </head>
                <body>
                  <div class="success">
                    <h1>✅ Token Obtido com Sucesso!</h1>
                    <p>Copie as informações abaixo:</p>
                    <div class="token">
                      <strong>MYSHOPIFY_DOMAIN:</strong> "${shop}"<br><br>
                      <strong>SHOPIFY_ACCESS_TOKEN:</strong> "${response.access_token}"
                    </div>
                    <p>Você pode fechar esta janela e voltar ao terminal.</p>
                  </div>
                </body>
              </html>
            `);

            setTimeout(() => {
              console.log('✅ Servidor encerrado. Token salvo!\n');
              server.close();
              process.exit(0);
            }, 2000);
          } else {
            console.error('❌ Erro ao obter token:', data);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>❌ Erro ao obter token</h1><pre>' + data + '</pre>');
          }
        } catch (error) {
          console.error('❌ Erro ao processar resposta:', error);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end('<h1>❌ Erro ao processar resposta</h1>');
        }
      });
    });

    tokenReq.on('error', (error) => {
      console.error('❌ Erro na requisição:', error);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>❌ Erro na requisição</h1>');
    });

    tokenReq.write(postData);
    tokenReq.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Página não encontrada</h1>');
  }
});

server.listen(3000, () => {
  console.log('🌐 Servidor rodando em http://localhost:3000\n');
  console.log('⏳ Aguardando autorização...\n');
});
