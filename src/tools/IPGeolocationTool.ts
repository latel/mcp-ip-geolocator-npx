import axios from "axios";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

interface IPGeolocationResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

const IPGeolocationArgsSchema = z.object({
  ip: z.string().describe("IP address to lookup. Can be IPv4 (e.g., 8.8.8.8) or IPv6 (e.g., 2001:4860:4860::8888) format. Do not include protocols or ports, just the raw IP address.")
});

export class IPGeolocationTool {
  getToolDefinition() {
    return {
      name: "ip-geolocation",
      description: `Look up detailed geographic and network information for any IP address. This tool is useful when:
- User asks about the location of an IP address
- User wants to know where a server or website is hosted
- User needs to identify the ISP or organization behind an IP
- User wants timezone information for an IP location
- User asks about network routing or AS numbers
- User provides an IP and wants geographic details
- User wants to check their own IP location or current location
- User is planning travel (flights, trains) and needs location context
- User wants to check local weather for a specific IP location
- User needs geographic information for content delivery or services
- User is researching network infrastructure or security analysis

The tool returns comprehensive information including:
• Physical location (city, region, country, coordinates)
• Timezone information (useful for scheduling and time planning)
• Internet Service Provider (ISP) details
• Organization/company information
• Autonomous System (AS) number and name
• ZIP/postal code
• Geographic coordinates (latitude/longitude for mapping and distance calculations)

Works with both IPv4 and IPv6 addresses. No authentication required. Free service with reasonable rate limits.

Example usage scenarios:
- "Where is IP 8.8.8.8 located?" 
- "What ISP does 1.1.1.1 belong to?"
- "Show me details about this IP address"
- "Is this IP from my country?"
- "What's my current IP location?"
- "I need coordinates for this IP to plan my travel route"
- "What timezone is this server in for scheduling purposes?"
- "Get location info so I can check the local weather"`,
      inputSchema: zodToJsonSchema(IPGeolocationArgsSchema),
    };
  }

  private async fetchIPInfo(ip: string): Promise<IPGeolocationResponse> {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching IP info:", error);
      throw new Error("Failed to fetch IP information");
    }
  }

  async execute(args: any): Promise<any> {
    try {
      const parsed = IPGeolocationArgsSchema.parse(args);
      const data = await this.fetchIPInfo(parsed.ip);
      
      if (data.status !== "success") {
        throw new Error("IP lookup failed");
      }

      return {
        content: [{
          type: "text",
          text: `IP Location Information for ${parsed.ip}:
• Location: ${data.city}, ${data.regionName}, ${data.country}
• Coordinates: ${data.lat}, ${data.lon}
• Timezone: ${data.timezone}
• Network: ${data.isp} (${data.org})
• AS Number: ${data.as}`
        }],
      };
    } catch (error) {
      console.error("Tool execution error:", error);
      throw error;
    }
  }
}