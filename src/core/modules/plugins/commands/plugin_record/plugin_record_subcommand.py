from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.plugin_script_processes import PluginScriptProcesses
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_record import PluginRecord

SHOWN_OUTPUT_COUNT = 50


class PluginRecordSubcommand(ReadSubcommand[PluginRecord]):
    """Reads a plugin's recent outputs, last fault or input lines."""

    cli_name = "plugin"
    name = "record"

    def __init__(self, queries: Queries, folders: PluginFolders, scripts: PluginScriptProcesses) -> None:
        self.queries, self.folders, self.scripts = queries, folders, scripts

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")
        parser.add_argument("--inputs", action="store_true")

    def read(self, arguments: Namespace, caller: Caller) -> PluginRecord:
        plugin = self.queries.query(Plugin).filter(name=arguments.name).first()
        if plugin is None:
            raise Refusal(f"no plugin is called {arguments.name}", "journal plugin list shows them")
        outputs = self.queries.query(PluginOutput).filter(plugin_id=plugin.id).newest().page(1, SHOWN_OUTPUT_COUNT).rows
        services = [{"name": service.name, "condition": service.condition} for service in PluginManifest.read(self.folders.code(plugin.name)).services]
        inputs = self.sent_lines(plugin) if arguments.inputs else None
        return PluginRecord(plugin.name, [{"id": row.id, "output": row.output, "created_at": row.creation_timestamp().text} for row in reversed(outputs)], plugin.fault_count, plugin.last_fault, services, inputs)

    def sent_lines(self, plugin: Plugin) -> tuple[str, ...]:
        deliveries = self.queries.query(PluginDelivery).filter(plugin_id=plugin.id).newest().page(1, SHOWN_OUTPUT_COUNT).rows
        return (*(f"{row.event} {row.data}" for row in reversed(deliveries)), *self.scripts.lines(plugin.name))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginRecord):
            if value.inputs is not None:
                output.write("\n".join(value.inputs) or "it has been sent nothing yet", value.json())
                return
            lines = [str(row["output"]) for row in value.outputs]
            if value.last_fault:
                lines.append(f"last fault: {value.last_fault}")
            output.write("\n".join(lines) or "it has done nothing yet", value.json())
