from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.features.mcp.commands.mcp_command import McpCommand
from journal.features.mcp.listeners.restart_when_idle import RestartWhenIdle


class Mcp(Feature):
    name = "mcp"
    title = "MCP"
    help = "Integrations are MCP servers: suggested ones are installed from the viewer, let in with a key kept outside the project or by signing in, and the agents are restarted so they apply at once."
    commands = (McpCommand,)
    SIGN_IN_TO_THE_SERVER = Nudge(name, "sign_in_to_the_server", "sign in to {{title}}", "call its authenticate tool, mcp__{{name}}__authenticate, and when the browser has returned finish with complete_authentication; then say in the chat that {{title}} is signed in", repeat_after=0, answered_in_chat=True)
    nudges = (SIGN_IN_TO_THE_SERVER,)
    listeners = (RestartWhenIdle,)
