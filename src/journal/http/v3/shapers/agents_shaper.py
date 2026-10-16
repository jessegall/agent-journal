import json

from journal.engine.states.paused import Paused
from journal.engine.states_catalogue import StatesCatalogue
from journal.features.shell.commands.shell_command import RAN, RUNNING
from journal.features.tasks.states.working import Working
from journal.features.thinking.thoughts import Thoughts
from journal.hooks.context_file import ContextFile
from journal.http.v3.project_files import ProjectFiles
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, SYSTEM, V3Row, seconds
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries

STATUS = {"Idle": "idle", "SessionStarted": "idle", "SessionEnded": "stopped", "Compacting": "compacting", "PromptSubmitted": "busy", "ToolStarting": "busy", "ToolFinished": "busy", "SubagentStarted": "busy", "SubagentEnded": "busy"}
WORKING = frozenset({"working", "following_plan"})
"""The states in which the agent has declared its work: only then is it working, as version 3 had it; an agent merely running is busy."""
EVENT = {"ToolStarting": "PreToolUse", "ToolFinished": "PostToolUse", "PromptSubmitted": "UserPromptSubmit", "Idle": "Stop", "SessionStarted": "SessionStart", "SessionEnded": "SessionEnd", "Compacting": "PreCompact"}
PAUSED = frozenset({"waiting", "awaiting", "stuck"})
KEPT = 400
ENDS = frozenset({"Idle", "SessionStarted", "SessionEnded"})
"""The entries no Agent call of their session outlives: the turn that made it, or the session, is over."""
TOOL_VERBS = {"Read": "reading a file", "Edit": "editing a file", "Write": "writing a file", "MultiEdit": "editing files", "Grep": "searching", "Glob": "finding files", "Agent": "waiting for a subagent", "WebFetch": "fetching a page", "WebSearch": "searching the web", "Skill": "reading a skill"}


class AgentsShaper(Shaper):
    """An agent row as version 3 kept it: its status from its latest entry, and on its data the commits, skills and compactions the chat draws, read from the timeline."""

    type = "agent"

    def __init__(self, agents: Agents, entries: Entries, states: StatesCatalogue, context: ContextFile, files: ProjectFiles, thoughts: Thoughts) -> None:
        self.agents, self.entries, self.states, self.context, self.files, self.thoughts = agents, entries, states, context, files, thoughts

    def rows(self) -> list[V3Row]:
        recent = list(reversed(self.entries.of_kind_in(KEPT)))
        return [self.row(a, [e for e in recent if e.data.get("session") == a.session or (e.actor and e.actor.id == a.session)]) for a in self.agents.in_()]

    @staticmethod
    def commit_cards(entries) -> list[dict]:
        return [{"key": f"commit:{e.data['sha']}", "label": f"Agent committed {e.data['sha'][:8]} on `{e.data.get('branch', '')}`", "icon": "branch", "tone": "commit", "title": e.data.get("subject", ""), "at": seconds(e.created_at), "state": "", "detail": ""}
                for e in entries if e.kind == "commit"]

    def row(self, a, entries) -> V3Row:
        hooks = [e for e in entries if e.kind not in ("nudge", "created", "updated", "deleted", "commit")]
        moves = [e for e in hooks if e.kind in STATUS]
        last = moves[-1] if moves else None
        kind = last.kind if last else ""
        status = "stopped" if a.state == "ended" else "working" if a.state in WORKING and STATUS.get(kind, "idle") == "busy" else STATUS.get(kind, "idle")
        at = seconds(last.created_at) if last else seconds(a.updated_at)
        state = self.states.named(a.state, a.data)
        data = {
            "status": status, "event": EVENT.get(kind, kind), "tool": last.data.get("tool_name", "") if last and kind == "ToolStarting" else "", "file": "", "at": at,
            "provider": a.provider, "model": self.context.model(a.session), "effort": self.context.effort(a.session), "usage": {"windows": self.context.usage(a.session)}, "branch": self.files.branch(), "context": round((self.context.of(a.session) or 0) * 100), "started": seconds(a.created_at), "asking": {} if a.state != "waiting" else {"n": a.data.get("question_id", 0)},
            "doing": self.doing(a, state, [e for e in entries if e.kind in ("ToolStarting", "ToolFinished", RUNNING, RAN)]), "thinking": self.thoughts.latest(a.session), "last_message": next((e.data.get("delta", "") for e in reversed(hooks) if e.kind == "TurnWritten"), ""),
            "cards": self.commit_cards(entries), "skills": list((a.skills_loaded or {}).keys()), "skill_loads": [], "compactions": [{"at": seconds(e.created_at)} for e in hooks if e.kind == "Compacting"],
            "subagent_rows": (subagents := self.subagent_rows(self.entries.dispatches(a.session))), "subagents": len(subagents), "shell_rows": [], "monitor_rows": [], "commands": [], "parent": "", "stuck": a.data.get("why", "") if a.state == "stuck" else "", "state": a.state,
        }
        return V3Row.of("agent", a, title=a.session, seen=[SYSTEM, AGENT], data=data)

    @staticmethod
    def subagent_rows(hooks) -> list[dict]:
        """Each dispatch of a subagent, its finish paired to its start by the tool use's id, by order only when a hook carries none, so a start that never finished leaves the others alone: it starts with the Agent tool's call and ends with the tool's answer, or, for one launched in the background, with its own stop hook; a call the journal refused never ran and is no dispatch. A call with no answer when its turn ends was cut off, and a subagent in the background with no stop when its session ends went with it."""
        rows, open_, background = [], {}, {}
        for e in hooks:
            if e.kind in ENDS:
                AgentsShaper.stopped(open_, e)
                if e.kind == "SessionEnded" or (e.kind == "SessionStarted" and e.data.get("source") != "compact"):
                    AgentsShaper.stopped(background, e)
                continue
            if e.kind == "SubagentEnded":
                row = background.pop(e.data.get("agent_id", ""), None)
                if row:
                    row.update(status="done", running=False, ended=seconds(e.created_at))
                continue
            if e.data.get("tool_name") not in ("Agent", "Task") or e.data.get("refused"):
                continue
            given, use = e.data.get("tool_input", {}), e.data.get("tool_use_id", "")
            if e.kind == "ToolStarting":
                rows.append({"id": f"sub:{e.id}", "at": seconds(e.created_at), "task": given.get("description", "") or given.get("prompt", "")[:80], "type": given.get("subagent_type", "") or "subagent", "model": given.get("model", ""), "session": "", "status": "running", "running": True})
                open_[use or f"entry:{e.id}"] = rows[-1]
            elif e.kind == "ToolFinished" and open_:
                done = open_.pop(use) if use in open_ else open_.pop(next(iter(open_)))
                launched = AgentsShaper.launched(e.data.get("tool_response"))
                if launched:
                    background[launched] = done
                else:
                    done.update(status="done", running=False, ended=seconds(e.created_at))
        return rows

    @staticmethod
    def stopped(running: dict, e) -> None:
        """Each row still running ended at this entry, without the answer or the stop that would have closed it."""
        for row in running.values():
            row.update(status="stopped", running=False, ended=seconds(e.created_at))
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

    def doing(self, a, state, hooks) -> str:
        """What the agent is doing this moment: the shell part it runs, the tool it uses, or what its state says."""
        last = hooks[-1] if hooks else None
        if last and last.kind == RUNNING:
            return last.data["doing"]
        if last and last.kind == "ToolStarting":
            return TOOL_VERBS.get(last.data.get("tool_name", ""), "working")
        return self.described(state) or ("at work" if hooks else "")

    def described(self, state) -> str:
        """The work a state names: what a pause awaits, else the work it holds underneath, else the work declared without a task."""
        if isinstance(state, Paused):
            return state.awaiting()[0] or (self.described(self.states.named(state.resume["state"], state.resume["data"])) if state.resume else "")
        return state.what if isinstance(state, Working) else ""
