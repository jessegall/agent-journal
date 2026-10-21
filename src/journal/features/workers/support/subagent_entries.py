import json
import re

from journal.models.entry import Entry
from journal.models.subagent import Subagent
from journal.models.subagent_state import SubagentState
from journal.repositories.entries import Entries
from journal.support.agent_message import AgentMessage
from journal.support.subagent_dispatch import SubagentDispatch

ENDS = frozenset({"Stop", "SessionStarted", "SessionEnded"})
SUBAGENT_KINDS = ENDS | {"SubagentStarted", "SubagentEnded"}
TOOL_MOMENTS = ("ToolStarting", "ToolFinished", "ToolFailed")


class SubagentEntries:
    """The subagents an agent dispatched, paired from its session's entries: each dispatch, its answer, its start and end in the background, and a message that runs it again."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def running_mentioning(self, session: str, subject: str) -> int:
        return sum(1 for row in self.mentioning(session, subject) if row.is_running())

    def dispatches_mentioning(self, session: str, subject: str, start: float) -> list[Subagent]:
        return [row for row in self.mentioning(session, subject) if row.started_at >= start]

    def mentioning(self, session: str, subject: str) -> list[Subagent]:
        matched = re.compile(rf"\b{re.escape(subject)}\b", re.IGNORECASE)
        return [row for row in self.rows(session) if matched.search(row.brief)]

    def rows(self, session: str) -> list[Subagent]:
        return self.paired(self.entries.dispatches(session))

    @staticmethod
    def is_dispatch_entry(entry: Entry) -> bool:
        return entry.kind in SUBAGENT_KINDS or (entry.kind in TOOL_MOMENTS and isinstance(entry.recorded_call().operation, (SubagentDispatch, AgentMessage)))

    @staticmethod
    def paired(dispatches) -> list[Subagent]:
        rows: list[Subagent] = []
        open_: dict[str, int] = {}
        background: dict[str, int] = {}
        unstarted: dict[str, int] = {}
        for e in dispatches:
            time = e.created_at.timestamp()
            if e.kind in ENDS:
                SubagentEntries.stopped(rows, open_, time)
                if e.kind == "SessionEnded" or (e.kind == "SessionStarted" and e.data.get("source") != "compact"):
                    SubagentEntries.stopped(rows, background, time)
                    SubagentEntries.stopped(rows, unstarted, time)
                continue
            if e.kind == "SubagentStarted":
                SubagentEntries.started(rows, background, unstarted, e.data.get("agent_id", ""))
                continue
            if e.kind == "SubagentEnded":
                i = background.pop(e.data.get("agent_id", ""), None)
                if i is not None:
                    rows[i] = rows[i].finished(SubagentState.FINISHED, time)
                continue
            operation = e.recorded_call().operation
            if isinstance(operation, AgentMessage):
                SubagentEntries.resumed(rows, background, operation.receiver, e.kind, time)
                continue
            if not isinstance(operation, SubagentDispatch) or e.data.get("refused"):
                continue
            use = e.data.get("tool_use_id", "")
            if e.kind == "ToolStarting":
                brief = operation.brief or ""
                rows.append(Subagent(environment_id=e.environment_id, dispatch=f"sub:{e.id}", dispatcher=e.data.get("session_id", ""), started_at=time, task=operation.title or brief[:80], brief=f"{operation.title} {brief}", agent_type=operation.role or "subagent", model=operation.model))
                open_[use or f"entry:{e.id}"] = len(rows) - 1
            elif e.kind == "ToolFailed" and open_:
                i = open_.pop(use) if use in open_ else open_.pop(next(iter(open_)))
                rows[i] = rows[i].failed(str(e.data.get("error", "")), time)
            elif e.kind == "ToolFinished" and open_:
                i = open_.pop(use) if use in open_ else open_.pop(next(iter(open_)))
                answer = SubagentEntries.answered(e.data.get("tool_response"))
                rows[i] = rows[i].answered(answer.get("agentId", ""))
                background_run = answer.get("isAsync") or operation.background
                if background_run and rows[i].session:
                    background[rows[i].session] = i
                elif operation.background:
                    unstarted[f"row:{i}"] = i
                else:
                    rows[i] = rows[i].finished(SubagentState.FINISHED, time)
        return rows

    @staticmethod
    def started(rows: list[Subagent], background: dict[str, int], unstarted: dict[str, int], agent_id: str) -> None:
        if not unstarted or not agent_id:
            return
        i = unstarted.pop(next(iter(unstarted)))
        rows[i] = rows[i].answered(agent_id)
        background[agent_id] = i

    @staticmethod
    def resumed(rows: list[Subagent], background: dict[str, int], receiver: str, kind: str, time: float) -> None:
        if kind != "ToolStarting":
            return
        for i in [i for i, row in enumerate(rows) if row.session and row.session == receiver]:
            rows[i] = rows[i].resumed(time)
            background[receiver] = i

    @staticmethod
    def stopped(rows: list[Subagent], active: dict[str, int], time: float) -> None:
        for i in active.values():
            rows[i] = rows[i].finished(SubagentState.STOPPED, time)
        active.clear()

    @staticmethod
    def answered(response) -> dict:
        if isinstance(response, str):
            try:
                response = json.loads(response)
            except ValueError:
                return {}
        return response if isinstance(response, dict) else {}
