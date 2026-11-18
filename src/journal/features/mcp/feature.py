from journal.features.feature import Feature
from journal.features.mcp.commands.mcp_command import McpCommand
from journal.features.mcp.listeners.pending_restart import PendingRestart
from journal.features.mcp.listeners.pending_restart_tick import PendingRestartTick


class Mcp(Feature):
    name = "mcp"
    title = "MCP"
    help = "Integrations are MCP servers: suggested ones are installed from the viewer, let in with a key kept outside the project or by signing in, and the agents are restarted so they apply at once."
    commands = (McpCommand,)
    listeners = (PendingRestart, PendingRestartTick)
