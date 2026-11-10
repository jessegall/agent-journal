from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.mcp.commands.remove_server.remove_server import RemoveServer
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.modules.mcp.support.server_configs import ServerConfigs
from engine.private.server_keys import ServerKeys


class RemoveServerHandler(Handler[RemoveServer, McpServer]):
    """Deletes a server's row, drops its key and writes the agent programs' configs without it."""

    command = RemoveServer

    def __init__(self, servers: McpServerQuery, repository: Repository, configs: ServerConfigs, keys: ServerKeys) -> None:
        self.servers, self.repository, self.configs, self.keys = servers, repository, configs, keys

    def handle(self, command: RemoveServer, context: Context) -> McpServer:
        server = self.servers.find_name(command.name)
        self.repository.delete(server, context)
        if server.key_variable:
            self.keys.drop(server.key_variable)
        self.configs.write(dropped=[server.name])
        return server
