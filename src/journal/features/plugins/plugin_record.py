from journal.features.plugins.record_line import RecordLine
from journal.models.entry import Entry
from journal.repositories.entries import Entries

ROWS = {"tasks": "todo", "messages": "message", "plans": "plan", "docs": "doc", "reports": "report", "facts": "fact", "rules": "rule", "reminders": "reminder", "questions": "question", "checks": "check", "secrets": "secret", "task_logs": "todo"}
"""The viewer's name for each table whose rows open from the record."""
CHANGES = {"created": "made", "updated": "changed", "deleted": "deleted"}


class PluginRecord:
    """What a plugin did in the journal, newest first: its holds and lines to the agent, the commands it ran, its faults, and every row it wrote, each with when."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def of(self, name: str) -> list[RecordLine]:
        return [line for line in map(self.line, self.entries.of_actor(f"plugin:{name}")) if line]

    def line(self, entry: Entry) -> RecordLine | None:
        data, at = entry.data or {}, entry.created_at.timestamp()
        if entry.kind in CHANGES:
            kind = ROWS.get(data.get("table", ""))
            return RecordLine(at=at, kind="row", text=f"{CHANGES[entry.kind]} {data.get('table', '')[:-1].replace('_', ' ')} {data.get('id', '')}" + (f": {data['title']}" if data.get("title") else ""), ref=f"{kind}:{data.get('id')}" if kind and entry.kind != "deleted" else "")
        said = {
            "plugin_said": lambda: f"{data.get('how', '')} at {data.get('event', '')}: {data.get('words', '')}",
            "plugin_line_waiting": lambda: f"said after the reply to {data.get('event', '')}, for the agent's next hook: {data.get('line', '')}" if data.get("session") else f"said after the reply to {data.get('event', '')}, with no agent to hear it: {data.get('line', '')}",
            "plugin_command": lambda: f"ran {data.get('command', '')}" + (f", which failed: {data.get('err', '')}" if data.get("code") else ""),
            "plugin_fault": lambda: f"faulted at {data.get('event', '')}: {data.get('fault', '')}",
            "plugin_unanswered": lambda: f"refused {data.get('event', '')} after the reply, too late to hold it: {data.get('reason', '')}",
        }.get(entry.kind)
        return RecordLine(at=at, kind=entry.kind.removeprefix("plugin_"), text=said(), ref="") if said else None
