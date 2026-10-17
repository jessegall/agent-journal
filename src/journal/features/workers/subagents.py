import json
import re

from journal.repositories.entries import Entries

ENDS = frozenset({"Idle", "SessionStarted", "SessionEnded"})
"""The entries no Agent call of their session outlives: the turn that made it, or the session, is over."""


class Subagents:
    """The subagents an agent dispatched, read from its session's entries."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def running(self, session: str) -> int:
        return sum(1 for row in self.rows(session) if row["running"])

    def running_about(self, session: str, subject: str) -> int:
        """The subagents still out whose brief names the subject, such as plan 9: the reviewers of that plan and no others."""
        named = re.compile(rf"\b{re.escape(subject)}\b", re.IGNORECASE)
        return sum(1 for row in self.rows(session) if row["running"] and named.search(row["brief"]))

    def rows(self, session: str) -> list[dict]:
        """Each dispatch of a subagent, its finish paired to its start by the tool use's id, by order only when a hook carries none, so a start that never finished leaves the others alone: it starts with the Agent tool's call and ends with the tool's answer, or, for one launched in the background, with its own stop hook; a call the journal refused never ran and is no dispatch. A call with no answer when its turn ends was cut off, and a subagent in the background with no stop when its session ends went with it."""
        rows, open_, background = [], {}, {}
        for e in self.entries.dispatches(session):
            if e.kind in ENDS:
                Subagents.stopped(open_, e)
                if e.kind == "SessionEnded" or (e.kind == "SessionStarted" and e.data.get("source") != "compact"):
                    Subagents.stopped(background, e)
                continue
            if e.kind == "SubagentEnded":
                row = background.pop(e.data.get("agent_id", ""), None)
                if row:
                    row.update(status="done", running=False, ended=e.created_at.timestamp())
                continue
            if e.data.get("tool_name") not in ("Agent", "Task") or e.data.get("refused"):
                continue
            given, use = e.data.get("tool_input", {}), e.data.get("tool_use_id", "")
            if e.kind == "ToolStarting":
                rows.append({"id": f"sub:{e.id}", "at": e.created_at.timestamp(), "task": given.get("description", "") or given.get("prompt", "")[:80], "brief": f"{given.get('description', '')} {given.get('prompt', '')}", "type": given.get("subagent_type", "") or "subagent", "model": given.get("model", ""), "session": "", "status": "running", "running": True})
                open_[use or f"entry:{e.id}"] = rows[-1]
            elif e.kind == "ToolFinished" and open_:
                done = open_.pop(use) if use in open_ else open_.pop(next(iter(open_)))
                launched = Subagents.launched(e.data.get("tool_response"))
                if launched:
                    background[launched] = done
                else:
                    done.update(status="done", running=False, ended=e.created_at.timestamp())
        return rows

    @staticmethod
    def stopped(running: dict, e) -> None:
        """Each row still running ended at this entry, without the answer or the stop that would have closed it."""
        for row in running.values():
            row.update(status="stopped", running=False, ended=e.created_at.timestamp())
        running.clear()

    @staticmethod
    def launched(response) -> str:
        """The id of a subagent the Agent tool launched in the background, from its answer; empty when the answer is the finished work."""
        if isinstance(response, str):
            try:
                response = json.loads(response)
            except ValueError:
                return ""
        return response.get("agentId", "") if isinstance(response, dict) and response.get("isAsync") else ""
