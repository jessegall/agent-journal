import shlex

from core.base.actor_type import ActorType
from core.base.agent_checkouts import AgentCheckouts
from core.base.caller.caller import Caller
from core.base.caller.caller_request import CallerRequest
from core.base.cli.alias_options import AliasOptions
from core.base.cli.shell_aliases import ShellAliases
from core.base.checkout import Checkout
from core.base.checkout_type import CheckoutType
from core.base.cli.shell_run import ShellRun
from core.base.journal_home import JournalHome
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_names import AliasNames
from core.modules.aliases.support.alias_access import AliasAccess
from core.modules.plugins.support.plugin_alias_environment import PluginAliasEnvironment
from core.modules.plugins.support.plugin_alias_variables import PluginAliasVariables

JOURNAL_FOLDER_PREFIX = ".journal/"


class AliasShellAliases(ShellAliases):
    """Expands aliases with quoted arguments, declared access and paths from the journal folder, runs an agent
    that works in its own worktree in that worktree, and tells the command which checkout it runs in, so it
    needs no git call to learn its root, branch or base. A plugin's alias also gets the environment's name
    and settings file."""

    def __init__(self, aliases: AliasQuery, access: AliasAccess, names: AliasNames, home: JournalHome, checkouts: AgentCheckouts, plugin_variables: PluginAliasVariables) -> None:
        self.aliases, self.access, self.names, self.home, self.checkouts = aliases, access, names, home, checkouts
        self.plugin_variables = plugin_variables

    def shell_run(self, argv: list[str], caller: Caller, request: CallerRequest) -> ShellRun | None:
        alias = self.alias(argv[0]) if argv else None
        if alias is None:
            return None
        self.access.check(alias, caller)
        checkout = self.caller_checkout(caller)
        folder = str(checkout.root) if checkout.checkout_type is CheckoutType.WORKTREE and checkout.exists else request.folder
        return ShellRun(self.resolved_line(alias.shell_line(argv[1:])), {**request.variables, **checkout.variables(), **self.plugin_values(alias, caller), **alias.variable_values()}, folder)

    def plugin_values(self, alias: Alias, caller: Caller) -> PluginAliasEnvironment | dict[str, str]:
        return self.plugin_variables.variables(alias.plugin_id, caller.environment_id) if alias.plugin_id is not None else {}

    def caller_checkout(self, caller: Caller) -> Checkout:
        if caller.actor.type is ActorType.AGENT:
            return self.checkouts.checkout(caller.actor.id)
        return Checkout.project_checkout(self.home.project_folder, "")

    def resolved_line(self, line: str) -> str:
        return f"{shlex.quote(str(self.home.folder.resolve()))}/{line.removeprefix(JOURNAL_FOLDER_PREFIX)}" if line.startswith(JOURNAL_FOLDER_PREFIX) else line

    def options(self, name: str) -> AliasOptions | None:
        alias = self.alias(name)
        return AliasOptions(alias.background, alias.reader_id, alias.category, self.resolved_line(alias.shell_line([])).strip()) if alias else None

    def named_line(self, argv: list[str]) -> str | None:
        alias = self.alias(argv[0]) if argv else None
        return alias.shell_line(argv[1:]) if alias else None

    def alias(self, name: str) -> Alias | None:
        if name in self.names.command_names():
            return None
        return self.aliases.saved(name)
