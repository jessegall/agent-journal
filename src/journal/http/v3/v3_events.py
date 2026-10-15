from journal.http.v3.v3_row import seconds, who
from journal.models.entry import Entry

HOOKS = {"SessionStarted": "SessionStart", "PromptSubmitted": "UserPromptSubmit", "ToolStarting": "PreToolUse", "ToolFinished": "PostToolUse", "Compacting": "PreCompact", "Idle": "Stop", "SessionEnded": "SessionEnd", "SubagentStarted": "SubagentStart", "SubagentEnded": "SubagentStop", "TurnWritten": "MessageDisplay"}
TABLES = {"tasks": "todo", "messages": "message", "questions": "question", "facts": "fact", "rules": "rule", "reminders": "reminder", "plans": "plan", "reports": "report", "docs": "doc",
          "environments": "environment", "agents": "agent", "workers": "helper", "sequences": "sequence", "triggers": "trigger", "checks": "check", "settings": "feature", "links": "link", "task_logs": "work", "users": "user", "reactions": "reaction"}
CLOSES = {"tasks": "finished_at", "questions": "answer"}
"""The field whose change is a row's closing, which the activity rail labels as such."""


class V3Events:
    """An entry as a version 3 event: {id, at, type, n, action, actor, data, env}. A read is "updated" by "read", a finish is "completed", and an agent's update names its hook and tool."""

    @staticmethod
    def of(entry: Entry, environment: str, agent_n: int = 0) -> dict | None:
        at = seconds(entry.created_at)
        if entry.kind in HOOKS:
            return {"id": entry.id, "at": at, "type": "agent", "n": agent_n, "action": "reported", "actor": "agent", "data": {"event": entry.kind, "hook": HOOKS[entry.kind], "tool": entry.data.get("tool_name", "")}, "pid": 0, "handled": True, "env": environment}
        if entry.kind == "nudge":
            return {"id": entry.id, "at": at, "type": "nudge", "n": entry.id, "action": "created", "actor": "system", "data": {}, "pid": 0, "handled": True, "env": environment}
        if entry.kind in ("created", "updated", "deleted"):
            table = entry.data.get("table", "")
            kind = TABLES.get(table)
            if kind is None or kind in ("link", "user"):
                return None
            action, by = V3Events.action_of(entry, table)
            return {"id": entry.id, "at": at, "type": kind, "n": entry.data.get("id", 0), "action": action, "actor": who(entry.actor), "data": {"by": by, **({"setting": True} if table == "settings" else {})}, "pid": 0, "handled": True, "env": environment}
        return None

    @staticmethod
    def action_of(entry: Entry, table: str) -> tuple[str, str]:
        changed = set(entry.data.get("changed", []))
        if entry.kind == "updated" and "read_at" in changed:
            return "updated", "read"
        if entry.kind == "updated" and CLOSES.get(table) in changed:
            return "completed", ""
        return entry.kind, ""
