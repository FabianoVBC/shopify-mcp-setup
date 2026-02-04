# Shopify MCP Setup Guide for AI-Powered IDEs
### Complete Guide for Antigravity, Cursor, Claude Desktop & More

> **Author**: Community Contribution  
> **Last Updated**: February 2026  
> **Difficulty**: Intermediate  
> **Time Required**: 15-20 minutes

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Understanding the Two MCP Servers](#understanding-the-two-mcp-servers)
4. [Setup Part 1: Documentation Server (shopify-dev)](#setup-part-1-documentation-server-shopify-dev)
5. [Setup Part 2: Admin Server (shopify-admin)](#setup-part-2-admin-server-shopify-admin)
6. [OAuth Token Generation Script](#oauth-token-generation-script)
7. [Testing Your Setup](#testing-your-setup)
8. [Troubleshooting](#troubleshooting)
9. [What You Can Do Now](#what-you-can-do-now)

---

## 🎯 Overview

This guide shows you how to set up **two Shopify MCP servers** that enable your AI assistant to:

- ✅ Search Shopify documentation
- ✅ Generate validated GraphQL queries
- ✅ List and edit products in your store
- ✅ Manage orders, customers, and discounts
- ✅ Create draft orders and more

### Why Two Servers?

1. **`@shopify/dev-mcp`** (shopify-dev): Documentation and code generation (no auth required)
2. **`shopify-mcp-server`** (shopify-admin): Direct store interaction (requires OAuth token)

---

## ⚙️ Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18 or higher installed
- [ ] A Shopify store (any plan)
- [ ] Access to Shopify Partner Dashboard
- [ ] An AI IDE that supports MCP (Antigravity, Cursor, Claude Desktop, etc.)

---

## 🔍 Understanding the Two MCP Servers

### Server 1: `@shopify/dev-mcp` (Documentation)

**Purpose**: Query Shopify documentation and validate code  
**Authentication**: None required  
**Official**: Yes (by Shopify)  
**Documentation**: https://shopify.dev/docs/apps/build/devmcp

**What it does**:
- Searches Shopify docs
- Introspects GraphQL schemas
- Validates GraphQL queries
- Validates UI components (Polaris, POS, etc.)

### Server 2: `shopify-mcp-server` (Admin API)

**Purpose**: Interact directly with your Shopify store  
**Authentication**: OAuth Access Token (`shpat_`) required  
**Official**: Community/Third-party  

**What it does**:
- Get shop information
- List/create/update products
- Manage orders and customers
- Create discounts and draft orders
- And much more!

---

## 🚀 Setup Part 1: Documentation Server (shopify-dev)

### Step 1: Configure MCP Settings

Add this to your `mcp_config.json` (or equivalent for your IDE):

```json
{
  "mcpServers": {
    "shopify-dev": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"],
      "env": {
        "PATH": "/usr/local/bin:/usr/bin:/bin"
      }
    }
  }
}
```

> **Note**: Adjust the `PATH` to match your system's Node.js installation.

### Step 2: Restart Your IDE

After adding the configuration, restart your IDE to load the MCP server.

### Step 3: Test

Ask your AI assistant:
```
"Search Shopify docs for how to create a product using GraphQL"
```

If it responds with relevant documentation, ✅ **shopify-dev is working!**

---

## 🔐 Setup Part 2: Admin Server (shopify-admin)

This part requires generating an OAuth access token. Follow these steps carefully.

### Step 1: Create App in Shopify Partner Dashboard

1. Go to https://partners.shopify.com
2. Click **Apps** → **Create app**
3. Choose **"Start from Dev Dashboard"**
4. Fill in:
   - **App name**: `Antigravity MCP` (or any name)
   - **App URL**: `http://localhost:3000` (temporary)
5. Click **Create app**

### Step 2: Configure App Settings

1. In your app, go to **Configuration**
2. Under **URLs**, set:
   - **Allowed redirection URL(s)**: `http://localhost:3000/callback`
3. Under **API access scopes**, select:
   - ✅ `read_products`
   - ✅ `write_products`
   - ✅ `read_orders`
   - ✅ `read_customers`
   - ✅ `write_customers`
   - ✅ `read_discounts`
   - ✅ `write_discounts`
   - ✅ `read_draft_orders`
   - ✅ `write_draft_orders`
4. Click **Save**

### Step 3: Get Your App Credentials

1. Go to **Settings** tab in your app
2. Copy these values:
   - **Client ID**: `39fb2be3b079dc6204f1acb4107758e2` (example)
   - **Client secret**: `shpss_YOUR_CLIENT_SECRET_HERE` (example)

### Step 4: Install App on Your Store

1. In the Partner Dashboard, go to **Test on development store**
2. Select your store
3. Click **Install**
4. You'll be redirected to a URL like:
   ```
   http://localhost:3000/callback?hmac=...&shop=your-store.myshopify.com&...
   ```
   
   > This is expected! We'll handle this in the next step.

---

## 🔑 OAuth Token Generation Script

Now we need to exchange the OAuth authorization code for a permanent access token.

### Step 1: Create the Token Script

Save this as `get-shopify-token.js`:

```javascript
const http = require('http');
const url = require('url');
const https = require('https');

// REPLACE THESE WITH YOUR VALUES
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
```

### Step 2: Update Script with Your Credentials

Replace these values in the script:
- `CLIENT_ID`: Your app's Client ID
- `CLIENT_SECRET`: Your app's Client Secret
- `SHOP`: Your store's myshopify.com domain

### Step 3: Run the Script

```bash
node get-shopify-token.js
```

### Step 4: Authorize the App

1. The script will display a URL in the terminal
2. Open that URL in your browser
3. Click **"Install"** or **"Authorize"**
4. You'll be redirected to `http://localhost:3000/callback`
5. The token will appear both in the browser and terminal!

### Step 5: Copy Your Token

You'll see output like:
```
MYSHOPIFY_DOMAIN: "your-store.myshopify.com"
SHOPIFY_ACCESS_TOKEN: "shpat_YOUR_GENERATED_TOKEN_HERE"
```

**Save these values!** You'll need them in the next step.

---

## 🔧 Configure shopify-admin Server

Add this to your `mcp_config.json`:

```json
{
  "mcpServers": {
    "shopify-dev": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"],
      "env": {
        "PATH": "/usr/local/bin:/usr/bin:/bin"
      }
    },
    "shopify-admin": {
      "command": "npx",
      "args": ["-y", "shopify-mcp-server"],
      "env": {
        "MYSHOPIFY_DOMAIN": "your-store.myshopify.com",
        "SHOPIFY_ACCESS_TOKEN": "shpat_YOUR_TOKEN_HERE",
        "PATH": "/usr/local/bin:/usr/bin:/bin"
      }
    }
  }
}
```

**Replace**:
- `your-store.myshopify.com` with your actual domain
- `shpat_YOUR_TOKEN_HERE` with your actual token

---

## ✅ Testing Your Setup

### Restart Your IDE

After updating `mcp_config.json`, restart your IDE completely.

### Test shopify-dev

Ask your AI assistant:
```
"Search Shopify documentation for product mutations"
```

### Test shopify-admin

Ask your AI assistant:
```
"List my first 5 products from my Shopify store"
```

If both work, **🎉 Congratulations! Your setup is complete!**

---

## 🐛 Troubleshooting

### Error: "invalid character 'S' looking for beginning of value"

**Cause**: Invalid or expired access token  
**Solution**: Generate a new token using the OAuth script

### Error: "Connection closed"

**Cause**: MCP server not configured correctly  
**Solution**: 
1. Check `mcp_config.json` syntax
2. Verify Node.js is in PATH
3. Restart your IDE

### Error: "[API] Invalid API key or access token"

**Cause**: Token doesn't have required scopes  
**Solution**: Recreate the app with all necessary scopes selected

### OAuth Script Shows "hmac" Instead of "code"

**Cause**: You opened the install URL instead of the authorize URL  
**Solution**: The script will show you the correct authorize URL - click that link

### Token Not Appearing

**Cause**: Redirect URL mismatch  
**Solution**: Ensure redirect URL in Partner Dashboard exactly matches `http://localhost:3000/callback`

---

## 🎯 What You Can Do Now

With both MCP servers configured, your AI assistant can:

### Documentation & Code Generation (shopify-dev)
- ✅ Search all Shopify documentation
- ✅ Find GraphQL query/mutation examples
- ✅ Validate GraphQL operations
- ✅ Get API schema information
- ✅ Validate Polaris components

### Store Management (shopify-admin)
- ✅ Get shop information
- ✅ List products with filtering
- ✅ Create new products
- ✅ Update product details (title, description, price, etc.)
- ✅ Manage product variants
- ✅ List and view orders
- ✅ Get customer information
- ✅ Tag customers
- ✅ Create discount codes
- ✅ Create and complete draft orders
- ✅ Get collections
- ✅ And much more!

### Example Prompts to Try

```
"Show me all products with 'electric' in the title"
"Update product #12345 description to include SEO keywords"
"Create a 20% discount code valid for 7 days"
"List all orders from the last week"
"What are the required fields for creating a product?"
```

---

## 📚 Additional Resources

- [Shopify Dev MCP Official Docs](https://shopify.dev/docs/apps/build/devmcp)
- [Shopify Admin API Reference](https://shopify.dev/docs/api/admin-graphql)
- [OAuth Documentation](https://shopify.dev/docs/apps/build/authentication-authorization)
- [Partner Dashboard](https://partners.shopify.com)

---

## 🤝 Contributing

Found an issue or have improvements? This guide is community-maintained!

---

## 📝 License

This guide is provided as-is for educational purposes. Shopify and related trademarks are property of Shopify Inc.

---

**Happy coding! 🚀**
