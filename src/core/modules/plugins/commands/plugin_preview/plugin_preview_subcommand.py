from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.support.plugin_event_rows import PluginEventRows
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_preview import PluginPreview
from core.modules.plugins.support.plugin_staging import PluginStaging


class PluginPreviewSubcommand(ReadSubcommand[PluginPreview]):
    """`journal plugin preview <source>`: everything the plugin at a source would run, before it is installed.
    """

    cli_name = "plugin"
    name = "preview"

    def __init__(self, staging: PluginStaging, rows: PluginEventRows) -> None:
        self.staging = staging
        self.rows = rows

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("source")

    def read(self, arguments: Namespace, caller: Caller) -> PluginPreview:
        folder = self.staging.fetched(arguments.source)
        manifest = PluginManifest.read(folder)
        states = {(row.form, row.key): row.state.value for row in self.rows.rows(manifest, folder)}
        self.staging.cleared(arguments.source)
        return PluginPreview(manifest, arguments.source, states)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginPreview):
            output.write("\n".join(f"{row['category']} {row['label']}: {row['command']}" for row in value.manifest.run_rows()), value.json())
