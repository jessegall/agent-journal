from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.registry.registry import Registry
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.plugins.support.manifest_dashboard import ManifestDashboard
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginDashboardsSubcommand(ReadSubcommand[RowList]):
    """`journal plugin dashboards`: the dashboard each plugin switched on declares."""

    row_line = "{plugin}: {title}"
    empty_line = "no dashboards"

    cli_name = "plugin"
    name = "dashboards"

    def __init__(self, runnable: RunnablePlugins, registry: Registry) -> None:
        self.runnable, self.registry = runnable, registry

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        boards = [(runnable.plugin.name, runnable.manifest.dashboard) for runnable in self.runnable.running()]
        return RowList([{"id": name, "plugin": name, "title": board.title, "events": self.event_names(board)} for name, board in boards if board is not None])

    def event_names(self, board: ManifestDashboard) -> list[str]:
        names = [self.registry.event_name(key) for key in board.event_keys]
        return [name for name in names if name]
