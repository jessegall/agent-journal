import json
import re

from journal.features.workers.support.dispatch import Dispatch
from journal.repositories.entries import Entries
from journal.support.agent_message import AgentMessage
from journal.support.subagent_dispatch import SubagentDispatch

ENDS = frozenset({"Stop", "SessionStarted", "SessionEnded"})


class Subagents:
    """The subagents an agent dispatched, read from its session's entries."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def running(self, session: str) -> int:
        return sum(1 for row in self.rows(session) if row.is_active)

    def running_earlier(self, session: str) -> int:
        return sum(1 for row in self.rows(session)[:-1] if row.is_active)

    def running_mentioning(self, session: str, subject: str) -> int:
        return sum(1 for row in self.mentioning(session, subject) if row.is_active)

    def dispatches_mentioning(self, session: str, subject: str, start: float) -> list[Dispatch]:
        return [row for row in self.mentioning(session, subject) if row.time >= start]

    def mentioning(self, session: str, subject: str) -> list[Dispatch]:
        matched = re.compile(rf"\b{re.escape(subject)}\b", re.IGNORECASE)
        return [row for row in self.rows(session) if matched.search(row.brief)]

    def rows(self, session: str) -> list[Dispatch]:
        return self.paired(self.entries.dispatches(session))

    @staticmethod
    def paired(dispatches) -> list[Dispatch]:
        rows: list[Dispatch] = []
        open_: dict[str, int] = {}
        background: dict[str, int] = {}
        unstarted: dict[str, int] = {}
        for e in dispatches:
            time = e.created_at.timestamp()
            if e.kind in ENDS:
                Subagents.stopped(rows, open_, time)
                if e.kind == "SessionEnded" or (e.kind == "SessionStarted" and e.data.get("source") != "compact"):
                    Subagents.stopped(rows, background, time)
                    Subagents.stopped(rows, unstarted, time)
                continue
            if e.kind == "SubagentStarted":
                Subagents.started(rows, background, unstarted, e.data.get("agent_id", ""))
                continue
            if e.kind == "SubagentEnded":
                i = background.pop(e.data.get("agent_id", ""), None)
                if i is not None:
                    rows[i] = rows[i].finished("done", time)
                continue
            operation = e.recorded_call().get("operation", {})
            if operation.get("kind") == AgentMessage.kind:
                Subagents.resumed(rows, background, operation.get("receiver", ""), e.kind)
                continue
            if operation.get("kind") != SubagentDispatch.kind or e.data.get("refused"):
                continue
            use = e.data.get("tool_use_id", "")
            if e.kind == "ToolStarting":
                brief = operation["brief"] or ""
                rows.append(Dispatch(f"sub:{e.id}", time, operation["title"] or brief[:80], f"{operation['title']} {brief}", operation["role"] or "subagent", operation["model"]))
                open_[use or f"entry:{e.id}"] = len(rows) - 1
            elif e.kind == "ToolFailed" and open_:
                i = open_.pop(use) if use in open_ else open_.pop(next(iter(open_)))
                rows[i] = rows[i].failed(str(e.data.get("error", "")), time)
            elif e.kind == "ToolFinished" and open_:
                i = open_.pop(use) if use in open_ else open_.pop(next(iter(open_)))
                answer = Subagents.answered(e.data.get("tool_response"))
                rows[i] = rows[i].answered(answer.get("agentId", ""))
                background_run = answer.get("isAsync") or operation["background"]
                if background_run and rows[i].session:
                    background[rows[i].session] = i
                elif operation["background"]:
                    unstarted[f"row:{i}"] = i
                else:
                    rows[i] = rows[i].finished("done", time)
        return rows

    @staticmethod
    def started(rows: list[Dispatch], background: dict[str, int], unstarted: dict[str, int], agent_id: str) -> None:
        if not unstarted or not agent_id:
            return
        i = unstarted.pop(next(iter(unstarted)))
        rows[i] = rows[i].answered(agent_id)
        background[agent_id] = i

    @staticmethod
    def resumed(rows: list[Dispatch], background: dict[str, int], receiver: str, kind: str) -> None:
        if kind != "ToolStarting":
            return
        for i in [i for i, row in enumerate(rows) if row.session and row.session == receiver]:
            rows[i] = rows[i].resumed()
            background[receiver] = i

    @staticmethod
    def stopped(rows: list[Dispatch], active: dict[str, int], time: float) -> None:
        for i in active.values():
            rows[i] = rows[i].finished("stopped", time)
        active.clear()

    @staticmethod
    def answered(response) -> dict:
        if isinstance(response, str):
            try:
                response = json.loads(response)
            except ValueError:
                return {}
        return response if isinstance(response, dict) else {}
