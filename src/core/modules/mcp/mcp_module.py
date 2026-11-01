from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.mcp.commands.give_server_key.give_server_key_handler import GiveServerKeyHandler
from core.modules.mcp.commands.install_server.install_server_handler import InstallServerHandler
from core.modules.mcp.commands.mcp_check.mcp_check_subcommand import McpCheckSubcommand
from core.modules.mcp.commands.mcp_install.mcp_install_subcommand import McpInstallSubcommand
from core.modules.mcp.commands.mcp_key.mcp_key_subcommand import McpKeySubcommand
from core.modules.mcp.commands.mcp_list.mcp_list_subcommand import McpListSubcommand
from core.modules.mcp.commands.mcp_remove.mcp_remove_subcommand import McpRemoveSubcommand
from core.modules.mcp.commands.mcp_suggested.mcp_suggested_subcommand import McpSuggestedSubcommand
from core.modules.mcp.commands.remove_server.remove_server_handler import RemoveServerHandler
from core.modules.mcp.migrations.m001_mcp_servers import McpServersTableMigration
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.modules.mcp.upgrade.mcp_servers_move import McpServersMove


class McpModule(Module):
    """Adds MCP servers: the suggested ones installed by name into Claude Code's .mcp.json and Codex's
    .codex/config.toml with their keys only as variables, the keys kept outside the project and given to the
    agent programs at launch, and the Integrations window."""

    name = "journal.core.mcp"
    seed_reason = "a server is installed by the person, with their own accounts"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.secrets"]
    models = [ModelDeclaration(McpServer, query=McpServerQuery, excluded_subcommands=["make", "edit", "show", "list", "delete"])]
    migrations = [McpServersTableMigration]
    moves = [McpServersMove]
    handlers = [InstallServerHandler, GiveServerKeyHandler, RemoveServerHandler]
    subcommands = (McpListSubcommand, McpSuggestedSubcommand, McpInstallSubcommand, McpKeySubcommand, McpRemoveSubcommand, McpCheckSubcommand)
    windows = [WindowDeclaration("mcp.integrations", "Integrations", "integrations.js", WindowLoading.COMPONENT, group="project", icon=WindowIcon.PLUGIN,
                                 reads=["mcp list", "mcp suggested"], runs=["mcp install", "mcp key", "mcp remove"])]
