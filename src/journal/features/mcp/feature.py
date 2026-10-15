from journal.features.feature import Feature
from journal.features.mcp.commands.mcp_command import McpCommand


class Mcp(Feature):
    name = "mcp"
    title = "Integrations"
    help = "Integrations are MCP servers: suggested ones are installed from the viewer, let in with a key kept outside the project or by signing in, and the agents are restarted so they apply at once."
    commands = (McpCommand,)
