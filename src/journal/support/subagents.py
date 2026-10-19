import json
import re

from journal.features.workers.support.dispatch import Dispatch
from journal.repositories.entries import Entries

ENDS = frozenset({"Idle", "SessionStarted", "SessionEnded"})
"""The entries no Agent call of their session outlives: the turn that made it, or the session, is over."""


class Subagents:
    """The subagents an agent dispatched, read from its session's entries."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def running(self, session: str) -> int:
        return sum(1 for row in self.rows(session) if row.running)

    def running_about(self, session: str, subject: str) -> int:
        """The subagents still out whose brief names the subject, such as plan 9: the reviewers of that plan and no others."""
        named = re.compile(rf"\b{re.escape(subject)}\b", re.IGNORECASE)
        return sum(1 for row in self.rows(session) if row.running and named.search(row.brief))

    def rows(self, session: str) -> list[Dispatch]:
        return self.paired(self.entries.dispatches(session))

    @staticmethod
    def paired(dispatches) -> list[Dispatch]:
        """Each dispatch of a subagent, its finish paired to its start by the tool use's id, by order only when a hook carries none, so a start that never finished leaves the others alone: it starts with the Agent tool's call and ends with the tool's answer, or, for one launched in the background, with its own stop hook; a call the journal refused never ran and is no dispatch. A call with no answer when its turn ends was cut off, and a subagent in the background with no stop when its session ends went with it."""
        rows: list[Dispatch] = []
        open_: dict[str, int] = {}
        background: dict[str, int] = {}
        for e in dispatches:
            at = e.created_at.timestamp()
            if e.kind in ENDS:
                Subagents.stopped(rows, open_, at)
                if e.kind == "SessionEnded" or (e.kind == "SessionStarted" and e.data.get("source") != "compact"):
                    Subagents.stopped(rows, background, at)
                continue
            if e.kind == "SubagentEnded":
                i = background.pop(e.data.get("agent_id", ""), None)
                if i is not None:
                    rows[i] = rows[i].settled("done", at)
                continue
            if e.data.get("tool_name") not in ("Agent", "Task") or e.data.get("refused"):
                continue
            given, use = e.data.get("tool_input", {}), e.data.get("tool_use_id", "")
            if e.kind == "ToolStarting":
                rows.append(Dispatch(f"sub:{e.id}", at, given.get("description", "") or given.get("prompt", "")[:80], f"{given.get('description', '')} {given.get('prompt', '')}", given.get("subagent_type", "") or "subagent", given.get("model", "")))
                open_[use or f"entry:{e.id}"] = len(rows) - 1
            elif e.kind == "ToolFinished" and open_:
                i = open_.pop(use) if use in open_ else open_.pop(next(iter(open_)))
                answer = Subagents.answered(e.data.get("tool_response"))
                rows[i] = rows[i].answered(answer.get("agentId", ""))
                if answer.get("isAsync") and rows[i].session:
                    background[rows[i].session] = i
                else:
                    rows[i] = rows[i].settled("done", at)
        return rows

    @staticmethod
    def stopped(rows: list[Dispatch], running: dict[str, int], at: float) -> None:
        """Each row still running ended at this moment, without the answer or the stop that would have closed it."""
        for i in running.values():
            rows[i] = rows[i].settled("stopped", at)
        running.clear()

    @staticmethod
    def answered(response) -> dict:
        """The Agent tool's answer as a mapping: its agentId names the subagent's transcript, and isAsync says it was launched in the background; empty when the answer is plain text."""
        if isinstance(response, str):
            try:
                response = json.loads(response)
            except ValueError:
                return {}
        return response if isinstance(response, dict) else {}
