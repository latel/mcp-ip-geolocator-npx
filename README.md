# MCP IP Geolocation Server

A Model Context Protocol (MCP) server that provides IP geolocation services via IP-API.com. Free to use, no API key required.

## Features

- Get detailed location information for any IP address
- Network information including ISP and AS number
- Timezone data
- No API key or registration required
- Clean, formatted output for Claude

## Quick Start

### Run with npx (No Installation Required)

The easiest way to use this MCP server:

```bash
npx mcp-ip-geolocator-npx
```

This will download and run the latest version without installing anything globally.

### Install Globally

If you prefer to install globally:

```bash
npm install -g mcp-ip-geolocator-npx
mcp-ip-geolocator
```

### Claude Desktop Configuration

Add to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "ip-geolocation": {
      "command": "npx",
      "args": ["mcp-ip-geolocator-npx"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "ip-geolocation": {
      "command": "mcp-ip-geolocator"
    }
  }
}
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/latel/mcp-ip-geolocator-npx.git
cd mcp-ip-geolocator-npx
```

2. Install dependencies:
```bash
npm install
```

3. Build and run:
```bash
npm run build
npm start
```

## Usage with Claude

Once running, connect to the server in Claude Desktop. Example usage:

```
Claude, can you check the location of IP address 8.8.8.8?
```

Claude will use the tool to fetch and display location information.

## API Response Format

The tool returns structured data including:
- City, region, and country
- Latitude and longitude
- Timezone
- ISP and organization
- AS number

## Rate Limiting

IP-API.com's free tier includes:
- 45 requests per minute
- IPv4 and IPv6 support
- No API key needed

## License

MIT License - feel free to use and modify!