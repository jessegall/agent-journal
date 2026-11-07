import json
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.modules.plugins.models.enums.plugin_card_tone import PluginCardTone
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_call_access import PluginCallAccess

CARD_TYPE = "command"


class PostPluginCardSubcommand(Subcommand[AddPluginOutput, PluginOutput]):
    """`journal plugin card <plugin> --label <line> [--detail <text>] [--tone <tone>] [--key <key>] [--agent <n>]`:
    a plugin's own program or alias shows a card in the chat of the agent that ran it, its detail folded."""

    cli_name = "plugin"
    name = "card"

    def __init__(self, plugins: PluginQuery, access: PluginCallAccess) -> None:
        self.plugins, self.access = plugins, access

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")
        parser.add_argument("--label", required=True)
        parser.add_argument("--detail", default="")
        parser.add_argument("--tone", choices=[tone.value for tone in PluginCardTone], default="")
        parser.add_argument("--key", default=CARD_TYPE)
        parser.add_argument("--agent", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AddPluginOutput:
        plugin = self.plugins.find_name(arguments.plugin)
        card = {"key": arguments.key, "type": CARD_TYPE, "label": arguments.label, "tone": arguments.tone, "detail": arguments.detail}
        return AddPluginOutput(plugin.id, self.access.agent_id(arguments.agent, caller), json.dumps({"cards": [card]}))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginOutput):
            output.write(f"card shown: {value.id}", output.values(value))
