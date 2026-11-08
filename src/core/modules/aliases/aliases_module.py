from core.base.cli.shell_aliases import ShellAliases
from core.modules.aliases.migrations.m003_alias_agent_access import AliasAgentAccessMigration
from core.modules.aliases.guards.reader_alias_guard import ReaderAliasGuard
from core.modules.aliases.guards.saved_command_guard import SavedCommandGuard
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.aliases.commands.add_alias.add_alias_handler import AddAliasHandler
from core.modules.aliases.commands.add_alias.add_alias_subcommand import AddAliasSubcommand
from core.modules.aliases.commands.edit_alias.edit_alias_handler import EditAliasHandler
from core.modules.aliases.commands.edit_alias.edit_alias_subcommand import EditAliasSubcommand
from core.modules.aliases.commands.remove_alias.remove_alias_handler import RemoveAliasHandler
from core.modules.aliases.commands.remove_alias.remove_alias_subcommand import RemoveAliasSubcommand
from core.modules.aliases.listeners.alias_file_listener import AliasFileListener
from core.modules.aliases.listeners.ended_run_silence_listener import EndedRunSilenceListener
from core.modules.aliases.listeners.plugin_aliases_listener import PluginAliasesListener
from core.modules.aliases.commands.set_alias_silence.set_alias_silence_handler import SetAliasSilenceHandler
from core.modules.aliases.ticks.silent_alias_marking import SilentAliasMarking
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.modules.aliases.migrations.m001_aliases import AliasesTableMigration
from core.modules.aliases.migrations.m002_alias_category import AliasCategoryMigration
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.models.command_type import CommandType
from core.modules.aliases.migrations.m004_command_kinds import CommandKindsMigration
from core.modules.aliases.migrations.m005_alias_silence import AliasSilenceMigration
from core.modules.aliases.migrations.m006_command_types import CommandTypesMigration
from core.modules.aliases.models.saved_command import SavedCommand
from core.modules.aliases.commands.support.alias_saved_subcommand import AliasSavedSubcommand
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.seeders.aliases_seeder import AliasesSeeder
from core.modules.aliases.support.alias_shell_aliases import AliasShellAliases
from core.modules.aliases.upgrade.aliases_move import AliasesMove
from core.modules.aliases.commands.skip_saved_command.skip_saved_command_subcommand import SkipSavedCommandSubcommand
from core.modules.aliases.rules.alias_expansion_rule import AliasExpansionRule
from core.modules.aliases.rules.saved_command_rule import SavedCommandRule
from core.modules.aliases.rules.unknown_command_rule import UnknownCommandRule
from core.modules.aliases.support.alias_nudges import (COMMAND_TYPE_UNKNOWN, ALIAS_ACCESS_REFUSED, ALIAS_MISSING, ALIAS_UNEXPANDED, SAVED_COMMAND_CHOICES, SAVED_COMMAND_DIRECT, SAVED_COMMAND_MIXED, SAVED_COMMAND_PIPED, SAVED_COMMAND_SILENT, SAVED_COMMAND_HELPER,
                                                       SAVED_COMMAND_UNKNOWN, SAVED_COMMAND_UNREAD, SAVED_COMMAND_TIMEOUT)


class AliasesModule(Module):
    """Adds aliases: words of the project's own that run a shell line, `journal <name> [args]`."""

    name = "journal.core.aliases"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.processes", "journal.core.plugins"]
    models = [ModelDeclaration(Alias, query=AliasQuery, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(CommandType)]
    views = [SavedCommand]
    migrations = [AliasesTableMigration, AliasCategoryMigration, AliasAgentAccessMigration, CommandKindsMigration, AliasSilenceMigration, CommandTypesMigration]
    moves = [AliasesMove]
    handlers = [AddAliasHandler, EditAliasHandler, RemoveAliasHandler, SetAliasSilenceHandler]
    subcommands = [AliasSavedSubcommand, AddAliasSubcommand, EditAliasSubcommand, RemoveAliasSubcommand, SkipSavedCommandSubcommand]
    bindings = {ShellAliases: AliasShellAliases}
    seeders = [AliasesSeeder]
    listeners = [AliasFileListener, PluginAliasesListener, EndedRunSilenceListener]
    tick_handlers = [TickHandler(TickInterval(seconds=1), SilentAliasMarking(), "silent aliases")]
    guards = [ReaderAliasGuard, SavedCommandGuard]
    driver_rules = [AliasExpansionRule, UnknownCommandRule, SavedCommandRule]
    nudges = [COMMAND_TYPE_UNKNOWN, ALIAS_UNEXPANDED, ALIAS_MISSING, ALIAS_ACCESS_REFUSED, SAVED_COMMAND_MIXED, SAVED_COMMAND_UNKNOWN, SAVED_COMMAND_CHOICES, SAVED_COMMAND_HELPER, SAVED_COMMAND_DIRECT, SAVED_COMMAND_PIPED, SAVED_COMMAND_UNREAD, SAVED_COMMAND_SILENT, SAVED_COMMAND_TIMEOUT]
