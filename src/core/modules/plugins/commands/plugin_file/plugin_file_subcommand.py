from argparse import ArgumentParser, Namespace

from engine.agent.agent_checkouts import AgentCheckouts
from engine.caller.caller import Caller
from core.base.scope.environment_scope import EnvironmentScope
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.support.plugin_call_access import PluginCallAccess
from core.modules.plugins.support.plugin_file_place import PluginFilePlace
from core.modules.plugins.support.plugin_file_text import PluginFileText


class PluginFileSubcommand(ReadSubcommand[str]):
    """Reads a file from an agent checkout, project or base commit."""

    cli_name = "plugin"
    name = "file"
    disabled_scopes = tuple([EnvironmentScope])

    def __init__(self, checkouts: AgentCheckouts, access: PluginCallAccess, files: PluginFileText) -> None:
        self.checkouts, self.access, self.files = checkouts, access, files

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("relative")
        parser.add_argument("--agent", type=int)
        parser.add_argument("--from", dest="place", choices=[place.value for place in PluginFilePlace], default=PluginFilePlace.CHECKOUT.value)

    def read(self, arguments: Namespace, caller: Caller) -> str:
        checkout = self.checkouts.checkout(self.access.agent_id(arguments.agent, caller))
        return self.files.text(checkout, arguments.relative, PluginFilePlace(arguments.place), caller)

    def write_output(self, value: object, output: Output) -> None:
        output.write(str(value), {"text": str(value)})
