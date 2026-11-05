from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_preview import PluginPreview
from core.modules.plugins.support.plugin_staging import PluginStaging


class PluginPreviewSubcommand(ReadSubcommand[PluginPreview]):
    """`journal plugin preview <source>`: everything the plugin at a source would run, before it is installed.
    """

    cli_name = "plugin"
    name = "preview"

    def __init__(self, staging: PluginStaging) -> None:
        self.staging = staging

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("source")

    def read(self, arguments: Namespace, caller: Caller) -> PluginPreview:
        manifest = PluginManifest.read(self.staging.fetched(arguments.source))
        self.staging.cleared(arguments.source)
        return PluginPreview(manifest, arguments.source)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginPreview):
            output.write("\n".join(f"{row['category']} {row['label']}: {row['command']}" for row in value.manifest.run_rows()), value.json())
