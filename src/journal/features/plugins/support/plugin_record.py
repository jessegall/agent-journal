from journal.features.plugins.support.record_line import RecordLine
from journal.models.entry import Entry
from journal.repositories.entries import Entries

OPENED = frozenset({"tasks", "messages", "plans", "docs", "reports", "facts", "rules", "reminders", "questions", "checks", "secrets"})
CHANGES = {"created": "made", "updated": "changed", "deleted": "deleted"}


class PluginRecord:
    """What a plugin did in the journal, newest first: its holds and lines to the agent, the commands it ran, its faults, and every row it wrote, each with when."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def of(self, name: str) -> list[RecordLine]:
        return [line for line in map(self.line, self.entries.of_actor(f"plugin:{name}")) if line]

    def line(self, entry: Entry) -> RecordLine | None:
        data, at = entry.data or {}, entry.created_at
        if entry.kind in CHANGES:
            table = data.get("table", "")
            opens = table in OPENED and entry.kind != "deleted"
            return RecordLine(at=at, kind="row", text=f"{CHANGES[entry.kind]} {table[:-1].replace('_', ' ')} {data.get('id', '')}" + (f": {data['title']}" if data.get("title") else ""), ref=f"{table}:{data.get('id')}" if opens else "")
        said = {
            "plugin_said": lambda: f"{data.get('how', '')} at {data.get('event', '')}: {data.get('words', '')}",
            "plugin_line_waiting": lambda: f"said after the reply to {data.get('event', '')}, for the agent's next hook: {data.get('line', '')}" if data.get("session") else f"said after the reply to {data.get('event', '')}, with no agent to hear it: {data.get('line', '')}",
            "plugin_command": lambda: f"ran {data.get('command', '')}" + (f", which failed: {data.get('err', '')}" if data.get("code") else ""),
            "plugin_fault": lambda: f"faulted at {data.get('event', '')}: {data.get('fault', '')}",
            "plugin_unanswered": lambda: f"refused {data.get('event', '')} after the reply, too late to hold it: {data.get('reason', '')}",
        }.get(entry.kind)
        return RecordLine(at=at, kind=entry.kind.removeprefix("plugin_"), text=said(), ref="") if said else None
