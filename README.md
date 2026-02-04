# Shopify MCP for AI IDEs

> Complete setup guide for integrating Shopify with AI-powered development environments using Model Context Protocol (MCP)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Shopify](https://img.shields.io/badge/Shopify-API-96bf48)](https://shopify.dev/)

## 🎯 What is This?

This repository provides a **complete, production-ready solution** for connecting your AI coding assistant (Antigravity, Cursor, Claude Desktop, etc.) to Shopify's APIs using the Model Context Protocol.

### What You'll Get

✅ **Full Shopify documentation access** in your AI assistant  
✅ **Direct store management** (products, orders, customers)  
✅ **GraphQL query validation** to prevent hallucinations  
✅ **OAuth token generation** with a simple script  
✅ **Step-by-step setup guide** with troubleshooting  

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A Shopify store (any plan)
- An AI IDE that supports MCP

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/FabianoVBC/shopify-mcp-setup.git
   cd shopify-mcp-setup
   ```

2. **Follow the complete guide**
   
   See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

3. **Generate your OAuth token**
   ```bash
   node scripts/get-shopify-token.js
   ```

4. **Configure your IDE**
   
   Copy the generated credentials to your `mcp_config.json`

## 📚 Documentation

- **[Complete Setup Guide](./SETUP_GUIDE.md)** - Step-by-step instructions
- **[Troubleshooting](./SETUP_GUIDE.md#troubleshooting)** - Common issues and solutions
- **[Examples](./examples/)** - Sample queries and use cases

## 🛠️ What Can You Do?

Once configured, ask your AI assistant things like:

```
"List all products with 'electric' in the title"
"Update product #12345 description"
"Create a 20% discount code valid for 7 days"
"Show me orders from the last week"
"What are the required fields for creating a product?"
```

## 🔧 Configuration

### Two MCP Servers

This setup uses **two complementary servers**:

#### 1. `@shopify/dev-mcp` (Documentation)
- Official Shopify server
- No authentication required
- Searches docs, validates code

#### 2. `shopify-mcp-server` (Admin API)
- Community server
- Requires OAuth token
- Direct store interaction

### Example Config

```json
{
  "mcpServers": {
    "shopify-dev": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"]
    },
    "shopify-admin": {
      "command": "npx",
      "args": ["-y", "shopify-mcp-server"],
      "env": {
        "MYSHOPIFY_DOMAIN": "your-store.myshopify.com",
        "SHOPIFY_ACCESS_TOKEN": "shpat_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

## 🎓 Why This Matters

### The Problem

- Shopify's official MCP server (`@shopify/dev-mcp`) only provides **documentation access**
- It cannot interact with your actual store data
- No official guide exists for OAuth token generation with MCP

### The Solution

This repository provides:

1. **Complete OAuth flow** implementation
2. **Token generation script** that works with any Shopify app
3. **Dual-server setup** for both docs and store management
4. **Production-ready configuration** examples

## 📁 Repository Structure

```
shopify-mcp-setup/
├── README.md                 # This file
├── SETUP_GUIDE.md           # Complete setup instructions
├── scripts/
│   └── get-shopify-token.js # OAuth token generator
├── examples/
│   ├── mcp_config.json      # Sample IDE configuration
│   └── sample-queries.md    # Example AI prompts
└── docs/
    ├── troubleshooting.md   # Common issues
    └── api-reference.md     # Available MCP tools
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report bugs** - Open an issue with details
2. **Suggest improvements** - Share your ideas
3. **Submit PRs** - Fix bugs or add features
4. **Share your experience** - Help others in discussions

### Development

```bash
# Clone the repo
git clone https://github.com/FabianoVBC/shopify-mcp-setup.git

# Test the OAuth script
cd scripts
node get-shopify-token.js
```

## 🐛 Troubleshooting

See the [Troubleshooting Guide](./SETUP_GUIDE.md#troubleshooting) for common issues.

Quick fixes:

- **Invalid token error**: Regenerate token with the script
- **Connection closed**: Check `mcp_config.json` syntax
- **HMAC instead of code**: Use the authorize URL, not install URL

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [Shopify](https://shopify.dev/) for the official dev-mcp server
- Community contributors to `shopify-mcp-server`
- AI IDE developers (Antigravity, Cursor, Claude Desktop)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/FabianoVBC/shopify-mcp-setup/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FabianoVBC/shopify-mcp-setup/discussions)
- **Shopify Docs**: https://shopify.dev/docs/apps/build/devmcp

## ⭐ Star This Repo

If this helped you, please star the repository to help others find it!

---

**Made with ❤️ by the community for developers using AI-powered IDEs**
