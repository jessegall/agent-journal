from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_search import WindowSearch
from core.modules.mcp.support.server_searcher import ServerSearcher
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_place import WindowPlace
from core.modules.mcp.commands.give_server_key.give_server_key_handler import GiveServerKeyHandler
from core.modules.mcp.commands.install_server.install_server_handler import InstallServerHandler
from core.modules.mcp.commands.mcp_check.mcp_check_subcommand import McpCheckSubcommand
from core.modules.mcp.commands.install_server.install_server_subcommand import InstallServerSubcommand
from core.modules.mcp.commands.give_server_key.give_server_key_subcommand import GiveServerKeySubcommand
from core.modules.mcp.commands.mcp_list.mcp_list_subcommand import McpListSubcommand
from core.modules.mcp.commands.remove_server.remove_server_subcommand import RemoveServerSubcommand
from core.modules.mcp.commands.mcp_suggested.mcp_suggested_subcommand import McpSuggestedSubcommand
from core.modules.mcp.commands.remove_server.remove_server_handler import RemoveServerHandler
from core.modules.mcp.commands.add_server.add_server_handler import AddServerHandler
from core.modules.mcp.commands.add_server.add_server_subcommand import AddServerSubcommand
from core.modules.mcp.migrations.m001_mcp_servers import McpServersTableMigration
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.modules.mcp.upgrade.mcp_servers_move import McpServersMove
from core.modules.mcp.seeders.mcp_seeder import McpSeeder
from core.modules.mcp.support.skeletons import MCP_INTEGRATIONS_SKELETON


class McpModule(Module):
    """Adds MCP servers: the suggested ones installed by name into Claude Code's .mcp.json and Codex's
    .codex/config.toml with their keys only as variables, the keys kept outside the project and given to the
    agent programs at launch, and the Integrations window."""

    name = "journal.core.mcp"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.secrets"]
    seeders = [McpSeeder]
    models = [ModelDeclaration(McpServer, query=McpServerQuery, excluded_subcommands=["make", "edit", "show", "list", "delete"])]
    migrations = [McpServersTableMigration]
    moves = [McpServersMove]
    handlers = [AddServerHandler, InstallServerHandler, GiveServerKeyHandler, RemoveServerHandler]
    subcommands = [AddServerSubcommand, McpListSubcommand, McpSuggestedSubcommand, InstallServerSubcommand, GiveServerKeySubcommand, RemoveServerSubcommand, McpCheckSubcommand]
    windows = [WindowDeclaration("mcp.integrations", "Integrations", "integrations.js", WindowLoading.COMPONENT, skeleton=MCP_INTEGRATIONS_SKELETON, search=WindowSearch(ServerSearcher, "Search the servers"), place=WindowPlace.PAGE, group="project", icon=WindowIcon.PLUGIN,
                                 reads=["mcp list", "mcp suggested", "mcp check"], events=["mcp_server.*"], keys=[WindowKey("installed", "mcp list", events=["mcp_server.*"]),
                                                                                         WindowKey("suggested", "mcp suggested"),
                                                                                         WindowKey("check", "mcp check")], runs=["mcp add", "mcp install", "mcp key", "mcp remove", "message send"])]
