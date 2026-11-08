from argparse import ArgumentParser, Namespace

from core.base.agent_checkouts import AgentCheckouts
from core.base.caller.caller import Caller
from core.base.checkout_file import CheckoutFile
from core.base.scope.environment_scope import EnvironmentScope
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.plugins.support.plugin_call_access import PluginCallAccess

BASE = "base"


class PluginChangesSubcommand(ReadSubcommand[tuple[CheckoutFile, ...]]):
    """`journal plugin changes [--agent <n>] [--since <commit or base>]`: each name that differs in the checkout of an
    agent from a commit, by default and with `base` the commit its checkout was cut from, with files not yet committed
    and new ones."""

    cli_name = "plugin"
    name = "changes"
    disabled_scopes = tuple([EnvironmentScope])

    def __init__(self, checkouts: AgentCheckouts, access: PluginCallAccess) -> None:
        self.checkouts, self.access = checkouts, access

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int)
        parser.add_argument("--since", default=BASE)

    def read(self, arguments: Namespace, caller: Caller) -> tuple[CheckoutFile, ...]:
        since = "" if arguments.since == BASE else arguments.since
        return self.checkouts.changed_files(self.checkouts.checkout(self.access.agent_id(arguments.agent, caller)), since)

    def write_output(self, value: object, output: Output) -> None:
        files = [file for file in value if isinstance(file, CheckoutFile)] if is_tuple(value) else []
        output.write("\n".join(f"{file.status.value}  {file.relative}" for file in files) or "no name differs", {"rows": [file.values() for file in files]})
