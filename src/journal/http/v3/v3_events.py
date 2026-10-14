from journal.http.v3.v3_row import seconds, who
from journal.models.entry import Entry

HOOK_KINDS = {"SessionStarted", "PromptSubmitted", "ToolStarting", "ToolFinished", "Compacting", "Idle", "SessionEnded", "SubagentStarted", "SubagentEnded", "TurnWritten"}
TABLES = {"tasks": "todo", "messages": "message", "questions": "question", "facts": "fact", "rules": "rule", "reminders": "reminder", "plans": "plan", "reports": "report", "docs": "doc",
          "environments": "environment", "agents": "agent", "workers": "helper", "sequences": "sequence", "triggers": "trigger", "checks": "check", "settings": "feature", "links": "link", "task_logs": "work", "users": "user"}


class V3Events:
    """An entry as a version 3 event: {id, at, type, n, action, actor, data, env}."""

    @staticmethod
    def of(entry: Entry, environment: str, agent_n: int = 0) -> dict | None:
        at = seconds(entry.created_at)
        if entry.kind in HOOK_KINDS:
            return {"id": entry.id, "at": at, "type": "agent", "n": agent_n, "action": "reported", "actor": "agent", "data": {"event": entry.kind}, "pid": 0, "handled": True, "env": environment}
        if entry.kind == "nudge":
            return {"id": entry.id, "at": at, "type": "nudge", "n": entry.id, "action": "created", "actor": "system", "data": {}, "pid": 0, "handled": True, "env": environment}
        if entry.kind in ("created", "updated", "deleted"):
            table = entry.data.get("table", "")
            kind = TABLES.get(table)
            if kind is None or kind in ("link", "user", "feature"):
                return None
            return {"id": entry.id, "at": at, "type": kind, "n": entry.data.get("id", 0), "action": entry.kind, "actor": who(entry.actor), "data": {}, "pid": 0, "handled": True, "env": environment}
        return None
