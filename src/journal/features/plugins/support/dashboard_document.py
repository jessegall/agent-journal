import json

from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.plugins.support.dashboard_view import DashboardView
from journal.models.plugin import Plugin
from journal.repositories.dashboard_rows import DashboardRows


class DashboardDocument:
    """A plugin's dashboard as the viewer's dashboard draws it: the document the plugin wrote as dashboards/<name>.json in its data folder, else one page of the lines it set, each heading over its lines; a plugin's own pages never run in the viewer."""

    def __init__(self, rows: DashboardRows, folders: PluginFolders) -> None:
        self.rows, self.folders = rows, folders

    def of(self, plugin: Plugin) -> DashboardView:
        board = plugin.manifest.dashboard
        written = self.folders.data(plugin) / "dashboards" / f"{board.get('name', '')}.json"
        if board.get("name") and written.is_file():
            return DashboardView.from_json(json.loads(written.read_text()))
        lines = self.rows.of(plugin.name)
        if not lines:
            return DashboardView(missing=f"{plugin.name} has written nothing on its dashboard yet.")
        headed: dict[str, list] = {}
        for line in lines:
            headed.setdefault(line.section, []).append({"label": line.label, "badge": line.badge, "tone": line.tone, "note": line.note})
        children = [node for heading, items in headed.items() for node in ([{"type": "heading", "text": heading, "level": 3}] if heading else []) + [{"type": "list", "items": items}]]
        title = board.get("title", plugin.name)
        return DashboardView(title=title, start="start", pages={"start": {"title": title, "view": {"type": "stack", "children": children}}})
