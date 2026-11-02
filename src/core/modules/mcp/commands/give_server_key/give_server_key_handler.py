from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.modules.mcp.commands.give_server_key.give_server_key import GiveServerKey
from core.modules.mcp.models.enums.server_auth import ServerAuth
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.base.private.server_keys import ServerKeys


class GiveServerKeyHandler(Handler[GiveServerKey, McpServer]):
    """Writes a server's key into the keys file, never into a row; a server that signs in on its own or takes
    no key, and a blank key, are refused."""

    command = GiveServerKey

    def __init__(self, servers: McpServerQuery, keys: ServerKeys) -> None:
        self.servers, self.keys = servers, keys

    def handle(self, command: GiveServerKey, context: Context) -> McpServer:
        server = self.servers.find_name(command.name)
        if not server.needs_key:
            raise Refusal(f"{server.name} {'signs in on its own and takes' if server.auth is ServerAuth.OAUTH else 'takes'} no key")
        if not command.key.strip():
            raise Refusal(f"the key for {server.title} is blank")
        self.keys.put(server.key_variable, command.key.strip())
        return server
