from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_record import PluginRecord

SHOWN_OUTPUT_COUNT = 50


class PluginRecordSubcommand(ReadSubcommand[PluginRecord]):
    """`journal plugin record <name>`: what a plugin did, its newest outputs oldest first and its last fault."""

    cli_name = "plugin"
    name = "record"

    def __init__(self, queries: Queries, folders: PluginFolders) -> None:
        self.queries, self.folders = queries, folders

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")

    def read(self, arguments: Namespace, caller: Caller) -> PluginRecord:
        plugin = self.queries.query(Plugin).filter(name=arguments.name).first()
        if plugin is None:
            raise Refusal(f"no plugin is called {arguments.name}", "journal plugin list shows them")
        outputs = self.queries.query(PluginOutput).filter(plugin_id=plugin.id).newest().page(1, SHOWN_OUTPUT_COUNT).rows
        services = [{"name": service.name, "condition": service.condition} for service in PluginManifest.read(self.folders.code(plugin.name)).services]
        return PluginRecord(plugin.name, [{"id": row.id, "output": row.output, "created_at": row.creation_timestamp().text} for row in reversed(outputs)], plugin.fault_count, plugin.last_fault, services)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginRecord):
            lines = [str(row["output"]) for row in value.outputs]
            if value.last_fault:
                lines.append(f"last fault: {value.last_fault}")
            output.write("\n".join(lines) or "it has done nothing yet", value.json())
