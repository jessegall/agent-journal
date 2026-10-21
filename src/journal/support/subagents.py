import json
import re

from journal.features.workers.support.dispatch import Dispatch
from journal.repositories.entries import Entries

ENDS = frozenset({"Idle", "SessionStarted", "SessionEnded"})


class Subagents:
    """The subagents an agent dispatched, read from its session's entries."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def running(self, session: str) -> int:
        return sum(1 for row in self.rows(session) if row.running)

    def running_before_the_newest(self, session: str) -> int:
        return sum(1 for row in self.rows(session)[:-1] if row.running)

    def running_about(self, session: str, subject: str) -> int:
        return sum(1 for row in self.named_in_brief(session, subject) if row.running)

    def dispatched_about(self, session: str, subject: str, since: float) -> list[Dispatch]:
        return [row for row in self.named_in_brief(session, subject) if row.time >= since]

    def named_in_brief(self, session: str, subject: str) -> list[Dispatch]:
        named = re.compile(rf"\b{re.escape(subject)}\b", re.IGNORECASE)
        return [row for row in self.rows(session) if named.search(row.brief)]

    def rows(self, session: str) -> list[Dispatch]:
        return self.paired(self.entries.dispatches(session))

    @staticmethod
    def paired(dispatches) -> list[Dispatch]:
        rows: list[Dispatch] = []
        open_: dict[str, int] = {}
        background: dict[str, int] = {}
        for e in dispatches:
            time = e.created_at.timestamp()
            if e.kind in ENDS:
                Subagents.stopped(rows, open_, time)
                if e.kind == "SessionEnded" or (e.kind == "SessionStarted" and e.data.get("source") != "compact"):
                    Subagents.stopped(rows, background, time)
                continue
            if e.kind == "SubagentEnded":
                i = background.pop(e.data.get("agent_id", ""), None)
                if i is not None:
                    rows[i] = rows[i].settled("done", time)
                continue
            if e.data.get("tool_name") not in ("Agent", "Task") or e.data.get("refused"):
                continue
            given, use = e.data.get("tool_input", {}), e.data.get("tool_use_id", "")
            if e.kind == "ToolStarting":
                rows.append(Dispatch(f"sub:{e.id}", time, given.get("description", "") or given.get("prompt", "")[:80], f"{given.get('description', '')} {given.get('prompt', '')}", given.get("subagent_type", "") or "subagent", given.get("model", "")))
                open_[use or f"entry:{e.id}"] = len(rows) - 1
            elif e.kind == "ToolFinished" and open_:
                i = open_.pop(use) if use in open_ else open_.pop(next(iter(open_)))
                answer = Subagents.answered(e.data.get("tool_response"))
                rows[i] = rows[i].answered(answer.get("agentId", ""))
                if answer.get("isAsync") and rows[i].session:
                    background[rows[i].session] = i
                else:
                    rows[i] = rows[i].settled("done", time)
        return rows

    @staticmethod
    def stopped(rows: list[Dispatch], running: dict[str, int], time: float) -> None:
        for i in running.values():
            rows[i] = rows[i].settled("stopped", time)
        running.clear()

    @staticmethod
    def answered(response) -> dict:
        if isinstance(response, str):
            try:
                response = json.loads(response)
            except ValueError:
                return {}
        return response if isinstance(response, dict) else {}
