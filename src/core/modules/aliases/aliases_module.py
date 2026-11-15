from core.modules.aliases.policies.alias_expansion_policy import AliasExpansionPolicy
from core.modules.aliases.policies.saved_command_policy import SavedCommandPolicy
from core.modules.aliases.policies.unknown_command_policy import UnknownCommandPolicy
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
from core.modules.aliases.agent_messages.command_type_unknown_message import CommandTypeUnknownMessage
from core.modules.aliases.agent_messages.alias_access_refusal_message import AliasAccessRefusalMessage
from core.modules.aliases.agent_messages.alias_missing_message import AliasMissingMessage
from core.modules.aliases.agent_messages.alias_plugin_off_message import AliasPluginOffMessage
from core.modules.aliases.agent_messages.alias_unexpanded_message import AliasUnexpandedMessage
from core.modules.aliases.agent_messages.saved_command_choices_message import SavedCommandChoicesMessage
from core.modules.aliases.agent_messages.saved_command_direct_message import SavedCommandDirectMessage
from core.modules.aliases.agent_messages.saved_command_mixed_message import SavedCommandMixedMessage
from core.modules.aliases.agent_messages.saved_command_piped_message import SavedCommandPipedMessage
from core.modules.aliases.agent_messages.saved_command_silent_message import SavedCommandSilentMessage
from core.modules.aliases.agent_messages.saved_command_helper_message import SavedCommandHelperMessage
from core.modules.aliases.agent_messages.saved_command_unknown_message import SavedCommandUnknownMessage
from core.modules.aliases.agent_messages.saved_command_unread_message import SavedCommandUnreadMessage
from core.modules.aliases.agent_messages.saved_command_timeout_message import SavedCommandTimeoutMessage
from core.modules.aliases.tick_handlers.silent_alias_marking_tick_handler import SilentAliasMarkingTickHandler


class AliasesModule(Module):
    """Adds aliases: words of the project's own that run a shell line, `journal <name> [args]`."""

    name = "journal.core.aliases"
    policies = [AliasExpansionPolicy, SavedCommandPolicy, UnknownCommandPolicy]
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
    agent_messages = [CommandTypeUnknownMessage, AliasUnexpandedMessage, AliasMissingMessage, AliasPluginOffMessage, AliasAccessRefusalMessage, SavedCommandMixedMessage, SavedCommandUnknownMessage, SavedCommandChoicesMessage, SavedCommandHelperMessage, SavedCommandDirectMessage, SavedCommandPipedMessage, SavedCommandUnreadMessage, SavedCommandSilentMessage, SavedCommandTimeoutMessage]
