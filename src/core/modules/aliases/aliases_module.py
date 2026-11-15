from core.modules.aliases.models.declarations.alias_model_declaration import AliasModelDeclaration
from core.modules.aliases.migrations.m007_alias_category_index import AliasCategoryIndexMigration
from engine.cli.shell_aliases import ShellAliases
from core.modules.aliases.migrations.m003_alias_agent_access import AliasAgentAccessMigration
from core.modules.aliases.guards.reader_alias_guard import ReaderAliasGuard
from core.modules.aliases.guards.saved_command_guard import SavedCommandGuard
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
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
from core.modules.aliases.migrations.m001_aliases import AliasesTableMigration
from core.modules.aliases.migrations.m002_alias_category import AliasCategoryMigration
from core.modules.aliases.models.command_type import CommandType
from core.modules.aliases.migrations.m004_command_kinds import CommandPrefixesMigration
from core.modules.aliases.migrations.m005_alias_silence import AliasSilenceMigration
from core.modules.aliases.migrations.m006_command_types import CommandTypesMigration
from core.modules.aliases.models.saved_command import SavedCommand
from core.modules.aliases.commands.support.alias_saved_subcommand import AliasSavedSubcommand
from core.modules.aliases.seeders.aliases_seeder import AliasesSeeder
from core.modules.aliases.support.alias_shell_aliases import AliasShellAliases
from core.modules.aliases.upgrade.aliases_move import AliasesMove
from core.modules.aliases.commands.skip_saved_command.skip_saved_command_subcommand import SkipSavedCommandSubcommand
from core.modules.aliases.rules.alias_expansion_rule import AliasExpansionRule
from core.modules.aliases.rules.saved_command_rule import SavedCommandRule
from core.modules.aliases.rules.unknown_command_rule import UnknownCommandRule
from core.modules.aliases.nudges.command_type_unknown_nudge import CommandTypeUnknownNudge
from core.modules.aliases.nudges.alias_access_refused_nudge import AliasAccessRefusedNudge
from core.modules.aliases.nudges.alias_missing_nudge import AliasMissingNudge
from core.modules.aliases.nudges.alias_plugin_off_nudge import AliasPluginOffNudge
from core.modules.aliases.nudges.alias_unexpanded_nudge import AliasUnexpandedNudge
from core.modules.aliases.nudges.saved_command_choices_nudge import SavedCommandChoicesNudge
from core.modules.aliases.nudges.saved_command_direct_nudge import SavedCommandDirectNudge
from core.modules.aliases.nudges.saved_command_mixed_nudge import SavedCommandMixedNudge
from core.modules.aliases.nudges.saved_command_piped_nudge import SavedCommandPipedNudge
from core.modules.aliases.nudges.saved_command_silent_nudge import SavedCommandSilentNudge
from core.modules.aliases.nudges.saved_command_helper_nudge import SavedCommandHelperNudge
from core.modules.aliases.nudges.saved_command_unknown_nudge import SavedCommandUnknownNudge
from core.modules.aliases.nudges.saved_command_unread_nudge import SavedCommandUnreadNudge
from core.modules.aliases.nudges.saved_command_timeout_nudge import SavedCommandTimeoutNudge
from core.modules.aliases.tick_handlers.silent_alias_marking_tick_handler import SilentAliasMarkingTickHandler


class AliasesModule(Module):
    """Adds aliases: words of the project's own that run a shell line, `journal <name> [args]`."""

    name = "journal.core.aliases"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.processes", "journal.core.plugins", "journal.core.drivers"]
    models = [AliasModelDeclaration, ModelDeclaration(CommandType)]
    views = [SavedCommand]
    migrations = [AliasCategoryIndexMigration, AliasesTableMigration, AliasCategoryMigration, AliasAgentAccessMigration, CommandPrefixesMigration, AliasSilenceMigration, CommandTypesMigration]
    moves = [AliasesMove]
    handlers = [AddAliasHandler, EditAliasHandler, RemoveAliasHandler, SetAliasSilenceHandler]
    subcommands = [AliasSavedSubcommand, AddAliasSubcommand, EditAliasSubcommand, RemoveAliasSubcommand, SkipSavedCommandSubcommand]
    bindings = {ShellAliases: AliasShellAliases}
    seeders = [AliasesSeeder]
    listeners = [AliasFileListener, PluginAliasesListener, EndedRunSilenceListener]
    tick_handlers = [SilentAliasMarkingTickHandler]
    guards = [ReaderAliasGuard, SavedCommandGuard]
    driver_rules = [AliasExpansionRule, UnknownCommandRule, SavedCommandRule]
    nudges = [CommandTypeUnknownNudge, AliasUnexpandedNudge, AliasMissingNudge, AliasPluginOffNudge, AliasAccessRefusedNudge, SavedCommandMixedNudge, SavedCommandUnknownNudge, SavedCommandChoicesNudge, SavedCommandHelperNudge, SavedCommandDirectNudge, SavedCommandPipedNudge, SavedCommandUnreadNudge, SavedCommandSilentNudge, SavedCommandTimeoutNudge]
