#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { IPGeolocationTool } from './tools/IPGeolocationTool.js';

const server = new Server(
  {
    name: "ip-geolocation-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
    instructions: `This is an IP Geolocation MCP Server that provides tools to look up geographic and network information for IP addresses.

Available capabilities:
- Look up location details for any IPv4 or IPv6 address
- Get ISP and organization information
- Retrieve timezone data for IP locations
- Find coordinates and regional information
- Identify network providers and AS numbers
- Check user's current IP location
- Get geographic data for travel planning
- Obtain location info for weather queries

The server uses the free IP-API.com service, so no API keys are required. It's perfect for:
- Security analysis and threat investigation
- Network troubleshooting and diagnostics  
- Geographic content delivery optimization
- Understanding website/server locations
- Educational purposes about internet infrastructure
- Personal location checking and identification
- Travel planning and route optimization (getting coordinates for flights/trains)
- Weather-related location queries (finding local weather for IP locations)
- Timezone coordination and scheduling across different regions

Use the ip-geolocation tool when users ask about IP addresses, server locations, network information, their own location, travel planning context, or need geographic data for weather/timezone purposes.`,
  }
);

const ipTool = new IPGeolocationTool();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [ipTool.getToolDefinition()],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "ip-geolocation") {
    return await ipTool.execute(args);
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  console.error('Starting IP Geolocation MCP Server...');
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("IP Geolocation MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});