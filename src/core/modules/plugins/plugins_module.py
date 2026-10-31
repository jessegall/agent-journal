from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.plugins.commands.configure_plugin_handler import ConfigurePluginHandler
from core.modules.plugins.commands.configure_plugin_subcommand import ConfigurePluginSubcommand
from core.modules.plugins.commands.disable_plugin_subcommand import DisablePluginSubcommand
from core.modules.plugins.commands.enable_plugin_subcommand import EnablePluginSubcommand
from core.modules.plugins.commands.install_plugin_handler import InstallPluginHandler
from core.modules.plugins.commands.install_plugin_subcommand import InstallPluginSubcommand
from core.modules.plugins.commands.plugin_list_subcommand import PluginListSubcommand
from core.modules.plugins.commands.plugin_settings_subcommand import PluginSettingsSubcommand
from core.modules.plugins.commands.propose_plugin_subcommand import ProposePluginSubcommand
from core.modules.plugins.commands.remove_plugin_handler import RemovePluginHandler
from core.modules.plugins.commands.remove_plugin_subcommand import RemovePluginSubcommand
from core.modules.plugins.commands.switch_plugin_handler import SwitchPluginHandler
from core.modules.plugins.migrations.m001_plugins import PluginsTablesMigration
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.upgrade.plugins_move import PluginsMove

BUILT = ["make", "edit", "show", "list", "delete"]


class PluginsModule(Module):
    """Adds plugins: programs the person installs into the journal, switches on or off and configures, which an
    agent may only propose."""

    name = "journal.core.plugins"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [ModelDeclaration(Plugin, query=PluginQuery, excluded_subcommands=BUILT), ModelDeclaration(PluginSetting, excluded_subcommands=BUILT)]
    moves = [PluginsMove]
    migrations = [PluginsTablesMigration]
    handlers = [InstallPluginHandler, SwitchPluginHandler, ConfigurePluginHandler, RemovePluginHandler]
    subcommands = (PluginListSubcommand, PluginSettingsSubcommand, ProposePluginSubcommand, InstallPluginSubcommand, EnablePluginSubcommand,
                   DisablePluginSubcommand, ConfigurePluginSubcommand, RemovePluginSubcommand)
