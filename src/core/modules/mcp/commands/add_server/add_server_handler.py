import re
import shlex

from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.command.person_check import PersonCheck
from core.modules.mcp.commands.add_server.add_server import AddServer
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.modules.mcp.support.server_catalogue import HTTP
from core.modules.mcp.support.server_configs import ServerConfigs

SERVER_NAME = re.compile(r"[a-z0-9][a-z0-9_-]*")
ADDRESS_PREFIXES = ("http://", "https://")


class AddServerHandler(Handler[AddServer, McpServer]):
    """Saves a server named by the user and writes every installed one into the agent programs' configs: an
    address is reached over http, anything else is the command that starts it."""

    command = AddServer

    def __init__(self, servers: McpServerQuery, repository: Repository, configs: ServerConfigs) -> None:
        self.servers, self.repository, self.configs = servers, repository, configs

    def handle(self, command: AddServer, context: Context) -> McpServer:
        PersonCheck.require(context, "only a user adds a server, since its command runs outside every hook")
        if not SERVER_NAME.fullmatch(command.name):
            raise Refusal(f"{command.name} cannot name a server", "use lowercase letters, digits, dashes and underscores")
        if self.servers.filter(name=command.name).exists():
            raise Refusal(f"{command.name} is installed already", "journal mcp list shows it")
        parts = shlex.split(command.target)
        if not parts:
            raise Refusal("give the server's address or the command that starts it")
        server = McpServer(creator_id=context.actor.id, name=command.name, title=command.name, transport=HTTP, url=parts[0]) if parts[0].startswith(ADDRESS_PREFIXES) \
            else McpServer(creator_id=context.actor.id, name=command.name, title=command.name, command=parts[0], args=tuple(parts[1:]))
        saved = self.repository.save(server, context)
        self.configs.write()
        return saved
