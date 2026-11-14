from core.modules.mcp.models.enums.server_auth import ServerAuth
from core.modules.mcp.models.mcp_server import McpServer
from engine.private.server_keys import ServerKeys

NEEDS_KEY = "needs its key"
OAUTH_SIGNING = "signs in on its own"
READY = "ready"


class ServerStanding:
    """How an installed server stands for the agents: waiting for its key, signing in on its own, or ready."""

    def __init__(self, keys: ServerKeys) -> None:
        self.keys = keys

    def standing(self, server: McpServer) -> str:
        if server.needs_key and not self.keys.has(server.key_variable):
            return NEEDS_KEY
        return OAUTH_SIGNING if server.auth is ServerAuth.OAUTH else READY
