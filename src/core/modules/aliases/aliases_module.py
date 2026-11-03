from core.base.cli.shell_aliases import ShellAliases
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.aliases.commands.add_alias.add_alias_handler import AddAliasHandler
from core.modules.aliases.commands.add_alias.add_alias_subcommand import AddAliasSubcommand
from core.modules.aliases.commands.edit_alias.edit_alias_handler import EditAliasHandler
from core.modules.aliases.commands.edit_alias.edit_alias_subcommand import EditAliasSubcommand
from core.modules.aliases.commands.remove_alias.remove_alias_handler import RemoveAliasHandler
from core.modules.aliases.commands.remove_alias.remove_alias_subcommand import RemoveAliasSubcommand
from core.modules.aliases.listeners.alias_file_listener import AliasFileListener
from core.modules.aliases.listeners.plugin_aliases_listener import PluginAliasesListener
from core.modules.aliases.migrations.m001_aliases import AliasesTableMigration
from core.modules.aliases.migrations.m002_alias_category import AliasCategoryMigration
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.seeders.aliases_seeder import AliasesSeeder
from core.modules.aliases.support.alias_shell_aliases import AliasShellAliases
from core.modules.aliases.upgrade.aliases_move import AliasesMove


class AliasesModule(Module):
    """Adds aliases: words of the project's own that run a shell line, `journal <name> [args]`."""

    name = "journal.core.aliases"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.processes", "journal.core.plugins"]
    models = [ModelDeclaration(Alias, query=AliasQuery, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [AliasesTableMigration, AliasCategoryMigration]
    moves = [AliasesMove]
    handlers = [AddAliasHandler, EditAliasHandler, RemoveAliasHandler]
    subcommands = (AddAliasSubcommand, EditAliasSubcommand, RemoveAliasSubcommand)
    bindings = [(ShellAliases, AliasShellAliases)]
    seeders = [AliasesSeeder]
    listeners = [AliasFileListener, PluginAliasesListener]
