from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.mcp.commands.install_server.install_server import InstallServer
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.modules.mcp.support.server_catalogue import ServerCatalogue
from core.modules.mcp.support.server_configs import ServerConfigs


class InstallServerHandler(Handler[InstallServer, McpServer]):
    """Saves a suggested server and writes every installed one into the agent programs' configs; a name the
    catalogue lacks, or a server installed already, is refused."""

    command = InstallServer

    def __init__(self, catalogue: ServerCatalogue, servers: McpServerQuery, repository: Repository, configs: ServerConfigs) -> None:
        self.catalogue, self.servers, self.repository, self.configs = catalogue, servers, repository, configs

    def handle(self, command: InstallServer, context: Context) -> McpServer:
        suggestion = self.catalogue.suggestion(command.name)
        if self.servers.filter(name=command.name).exists():
            raise Refusal(f"{command.name} is installed already", "journal mcp list shows it")
        server = self.repository.save(McpServer(creator_id=context.actor.id, name=suggestion.name, title=suggestion.title, transport=suggestion.transport,
                                                command=suggestion.command, args=suggestion.args, url=suggestion.url, key_variable=suggestion.key_variable,
                                                auth=suggestion.auth), context)
        self.configs.write()
        return server
