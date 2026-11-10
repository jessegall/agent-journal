from engine.file.file_access import FileAccess
import json
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_mapping
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_dashboard import PluginDashboard
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest

DASHBOARD_FOLDER = "dashboards"


class PluginDashboardSubcommand(ReadSubcommand[PluginDashboard]):
    """`journal plugin dashboard <name>`: the dashboard the plugin wrote as dashboards/<board>.json in its
    data folder."""

    cli_name = "plugin"
    name = "dashboard"

    def __init__(self, plugins: PluginQuery, folders: PluginFolders) -> None:
        self.plugins, self.folders = plugins, folders

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")

    def read(self, arguments: Namespace, caller: Caller) -> PluginDashboard:
        plugin = self.plugins.find_name(arguments.plugin)
        board = PluginManifest.read(self.folders.code(plugin.name)).dashboard
        if board is None:
            raise Refusal(f"{plugin.name} declares no dashboard", "journal plugin dashboards lists the ones declared")
        saved = self.folders.data(plugin.name) / DASHBOARD_FOLDER / f"{board.name}.json"
        if not saved.is_file():
            return PluginDashboard({"missing": f"{plugin.name} has written nothing on its dashboard yet."})
        try:
            dashboard: object = json.loads(FileAccess.shared().read(saved))
        except json.JSONDecodeError:
            return PluginDashboard({"broken": f"{saved.name} is not valid JSON."})
        if not is_mapping(dashboard) or not all(key in dashboard for key in ("start", "pages")):
            return PluginDashboard({"broken": f"{saved.name} does not state its start and pages."})
        return PluginDashboard({"title": dashboard["title"] if "title" in dashboard else board.title, "start": dashboard["start"], "pages": dashboard["pages"]})

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginDashboard):
            output.write(value.line(), value.json())
