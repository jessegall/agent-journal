from argparse import ArgumentParser, Namespace

from core.base.agent_checkouts import AgentCheckouts
from core.base.caller.caller import Caller
from core.base.checkout import Checkout
from core.base.scope.environment_scope import EnvironmentScope
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.support.plugin_call_access import PluginCallAccess


class PluginCheckoutSubcommand(ReadSubcommand[Checkout]):
    """`journal plugin checkout [--agent <n>]`: the folder an agent works in, as the line of an event gives it."""

    cli_name = "plugin"
    name = "checkout"
    disabled_scopes = tuple([EnvironmentScope])

    def __init__(self, checkouts: AgentCheckouts, access: PluginCallAccess) -> None:
        self.checkouts, self.access = checkouts, access

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> Checkout:
        return self.checkouts.checkout(self.access.agent_id(arguments.agent, caller))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Checkout):
            output.write("\n".join(f"{name}: {field}" for name, field in value.values().items()), value.values())
