from core.modules.aliases.declarations.aliases_dependencies import ALIASES_DEPENDENCIES
from core.modules.aliases.declarations.aliases_migrations import ALIASES_MIGRATIONS
from core.modules.aliases.declarations.aliases_subcommands import ALIASES_SUBCOMMANDS
from core.modules.aliases.declarations.aliases_agent_messages import ALIASES_AGENT_MESSAGES
from core.modules.aliases.policies.alias_expansion_policy import AliasExpansionPolicy
from core.modules.aliases.policies.saved_command_policy import SavedCommandPolicy
from core.modules.aliases.policies.unknown_command_policy import UnknownCommandPolicy
from core.modules.aliases.models.declarations.alias_model_declaration import AliasModelDeclaration
from engine.cli.shell_aliases import ShellAliases
from core.modules.aliases.guards.reader_alias_guard import ReaderAliasGuard
from core.modules.aliases.guards.saved_command_guard import SavedCommandGuard
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.aliases.commands.add_alias.add_alias_handler import AddAliasHandler
from core.modules.aliases.commands.edit_alias.edit_alias_handler import EditAliasHandler
from core.modules.aliases.commands.remove_alias.remove_alias_handler import RemoveAliasHandler
from core.modules.aliases.listeners.alias_file_listener import AliasFileListener
from core.modules.aliases.listeners.ended_run_silence_listener import EndedRunSilenceListener
from core.modules.aliases.listeners.plugin_aliases_listener import PluginAliasesListener
from core.modules.aliases.commands.set_alias_silence.set_alias_silence_handler import SetAliasSilenceHandler
from core.modules.aliases.models.command_type import CommandType
from core.modules.aliases.models.saved_command import SavedCommand
from core.modules.aliases.seeders.aliases_seeder import AliasesSeeder
from core.modules.aliases.support.alias_shell_aliases import AliasShellAliases
from core.modules.aliases.upgrade.aliases_move import AliasesMove
from core.modules.aliases.tick_handlers.silent_alias_marking_tick_handler import SilentAliasMarkingTickHandler


class AliasesModule(Module):
    """Adds aliases: words of the project's own that run a shell line, `journal <name> [args]`."""

    name = "journal.core.aliases"
    policies = [AliasExpansionPolicy, SavedCommandPolicy, UnknownCommandPolicy]
    requires_engine = ">=6,<7"
    dependencies = ALIASES_DEPENDENCIES
    models = [AliasModelDeclaration, ModelDeclaration(CommandType)]
    views = [SavedCommand]
    migrations = ALIASES_MIGRATIONS
    moves = [AliasesMove]
    handlers = [AddAliasHandler, EditAliasHandler, RemoveAliasHandler, SetAliasSilenceHandler]
    subcommands = ALIASES_SUBCOMMANDS
    bindings = {ShellAliases: AliasShellAliases}
    seeders = [AliasesSeeder]
    listeners = [AliasFileListener, PluginAliasesListener, EndedRunSilenceListener]
    tick_handlers = [SilentAliasMarkingTickHandler]
    guards = [ReaderAliasGuard, SavedCommandGuard]
    agent_messages = ALIASES_AGENT_MESSAGES
