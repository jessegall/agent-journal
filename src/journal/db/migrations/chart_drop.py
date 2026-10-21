from datetime import datetime, timezone
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

USER_WORKFLOWS = "SELECT id, title, event, state, shipped, revision FROM charts WHERE shipped = 0 OR updated_by NOT LIKE 'system%'"
NODES_OF = "SELECT nodes.id, nodes.kind, nodes.key, nodes.text FROM nodes JOIN links ON links.source = 'nodes:' || nodes.id WHERE links.kind = 'node_of' AND links.target = ? ORDER BY nodes.id"
LINES_OF = "SELECT source, target, kind FROM links WHERE kind IN ('yes', 'no', 'then') AND source IN ({refs}) ORDER BY id"
LINK_KINDS = ("node_of", "yes", "no", "then")
SETTING_KEYS = ("listeners.off", "chart.drawings_version", "features.chart")
ENTRY_KINDS = ("walk", "walk_failed")
TABLES = ("charts", "nodes", "counts", "noted_times")


class ChartDrop(Migration):
    """The workflows are gone: the states carry the journal's conduct. Each workflow the user made or edited is written as a document named after it, its nodes and lines in words, before the chart's tables drop; the links, settings and record rows of the chart go with the tables."""

    number: ClassVar[int] = 19

    def up(self, connection: Connection) -> None:
        tables = {row["name"] for row in connection.all("SELECT name FROM sqlite_master WHERE type = 'table'")}
        if "charts" in tables and "nodes" in tables:
            for chart in connection.all(USER_WORKFLOWS):
                self.document(connection, chart)
        for table in TABLES:
            connection.execute(f"DROP TABLE IF EXISTS {table}")
        connection.execute(f"DELETE FROM links WHERE kind IN ({', '.join('?' for _ in LINK_KINDS)})", LINK_KINDS)
        connection.execute(f"DELETE FROM settings WHERE key IN ({', '.join('?' for _ in SETTING_KEYS)})", SETTING_KEYS)
        connection.execute(f"DELETE FROM entries WHERE kind IN ({', '.join('?' for _ in ENTRY_KINDS)})", ENTRY_KINDS)

    def document(self, connection: Connection, chart) -> None:
        title = f"Workflow: {chart['title']}"
        if connection.one("SELECT id FROM docs WHERE title = ?", (title,)):
            return
        moment = datetime.now(timezone.utc).isoformat()
        place = f"at {chart['event']}" + (f" for the state {chart['state']}" if chart["state"] else "")
        abstract = f"A workflow the user {'edited' if chart['shipped'] else 'made'} {place}, written in words when the workflows went"
        connection.execute("INSERT INTO docs (created_at, created_by, updated_at, updated_by, title, abstract, body) VALUES (?, ?, ?, ?, ?, ?, ?)",
                           (moment, "system", moment, "system", title, abstract, self.body(connection, chart["id"])))

    @staticmethod
    def body(connection: Connection, chart_id: int) -> str:
        nodes = connection.all(NODES_OF, (f"charts:{chart_id}",))
        names = {f"nodes:{node['id']}": f"{node['kind']} {node['key']}" for node in nodes}
        text = ["## Nodes", *(f"- {node['kind']} {node['key']}" + (f": {node['text']}" if node["text"] else "") for node in nodes), "", "## Lines"]
        if nodes:
            refs = ", ".join("?" for _ in nodes)
            for link in connection.all(LINES_OF.format(refs=refs), tuple(names)):
                port = f" ({link['kind']})" if link["kind"] in ("yes", "no") else ""
                text.append(f"- {names.get(link['source'], link['source'])} to {names.get(link['target'], link['target'])}{port}")
        return "\n".join(text)
