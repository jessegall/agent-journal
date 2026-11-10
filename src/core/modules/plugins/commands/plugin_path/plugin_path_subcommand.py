from argparse import ArgumentParser, Namespace
from pathlib import Path

from engine.agent.agent_checkouts import AgentCheckouts
from engine.caller.caller import Caller
from engine.checkout.checkout import Checkout
from engine.errors.refusal import Refusal
from engine.scope.environment_scope import EnvironmentScope
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.support.plugin_call_access import PluginCallAccess
from core.modules.plugins.commands.plugin_path.support.checkout_path import CheckoutPath


class PluginPathSubcommand(ReadSubcommand[CheckoutPath]):
    """`journal plugin path <absolute> [--agent <n>]`: the relative name of a file and the checkout it belongs
    to, the agent's own worktree or else the project, the other way round from `journal plugin file`."""

    cli_name = "plugin"
    name = "path"
    disabled_scopes = tuple([EnvironmentScope])

    def __init__(self, checkouts: AgentCheckouts, access: PluginCallAccess) -> None:
        self.checkouts, self.access = checkouts, access

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("path")
        parser.add_argument("--agent", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> CheckoutPath:
        path = Path(arguments.path)
        real = path.parent.resolve() / path.name
        checkout = self.checkouts.checkout(self.access.agent_id(arguments.agent, caller))
        if not real.is_relative_to(checkout.root):
            checkout = Checkout.project_checkout(checkout.project_root, "")
        if not real.is_relative_to(checkout.root):
            raise Refusal(f"{arguments.path} is in no checkout of this project", "name a path inside the project or one of its worktrees")
        return CheckoutPath(str(real.relative_to(checkout.root)), checkout)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, CheckoutPath):
            lines = [f"relative: {value.relative}", *(f"{name}: {field}" for name, field in value.checkout.values().items())]
            output.write("\n".join(lines), value.values())
