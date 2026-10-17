from journal.models.plugin import Plugin
from journal.repositories.dashboard_rows import DashboardRows


class DashboardDocument:
    """A plugin's dashboard as the viewer's dashboard draws it: one page, each heading over the list of its lines; a plugin's own pages never run in the viewer."""

    def __init__(self, rows: DashboardRows) -> None:
        self.rows = rows

    def of(self, plugin: Plugin) -> dict:
        board = plugin.manifest.get("dashboard") or {}
        lines = self.rows.of(plugin.name)
        if not lines:
            return {"missing": f"{plugin.name} has written nothing on its dashboard yet."}
        headed: dict[str, list] = {}
        for line in lines:
            headed.setdefault(line.heading, []).append({"label": line.label, "badge": line.badge, "tone": line.tone, "note": line.note})
        children = [node for heading, items in headed.items() for node in ([{"type": "heading", "text": heading, "level": 3}] if heading else []) + [{"type": "list", "items": items}]]
        return {"start": "start", "pages": {"start": {"title": board.get("title", plugin.name), "view": {"type": "stack", "children": children}}}}
