import re

from journal.engine.states_catalogue import StatesCatalogue
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, SYSTEM, V3Row, seconds
from journal.models.environment import Environment
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries

STATUS = {"Idle": "idle", "SessionStarted": "idle", "SessionEnded": "stopped", "Compacting": "compacting", "PromptSubmitted": "working", "ToolStarting": "working", "ToolFinished": "working", "TurnWritten": "working", "SubagentStarted": "working", "SubagentEnded": "working"}
EVENT = {"ToolStarting": "PreToolUse", "ToolFinished": "PostToolUse", "PromptSubmitted": "UserPromptSubmit", "Idle": "Stop", "SessionStarted": "SessionStart", "SessionEnded": "SessionEnd", "Compacting": "PreCompact"}
PAUSED = frozenset({"waiting", "awaiting", "halted", "at_mark", "loading_skill"})
COMMITTED = re.compile(r"\[([^\s\]]+) ([0-9a-f]{7,})\] (.+)")
KEPT = 400


class AgentsShaper(Shaper):
    """An agent row as version 3 kept it: its status from its latest entry, and on its data the cards, whispers, skills and compactions the chat draws, read from the timeline."""

    type = "agent"

    def __init__(self, agents: Agents, entries: Entries, states: StatesCatalogue) -> None:
        self.agents, self.entries, self.states = agents, entries, states

    def rows(self, environment: Environment) -> list[V3Row]:
        recent = list(reversed(self.entries.of_kind_in(environment.id, KEPT)))
        return [self.row(a, [e for e in recent if e.data.get("session") == a.session or (e.actor and e.actor.id == a.session) or (e.kind == "card" and not e.data.get("session"))]) for a in self.agents.in_(environment.id)]

    @staticmethod
    def commit_cards(entries) -> list[dict]:
        return [{"key": f"commit:{e.data['sha']}", "label": f"Agent committed {e.data['sha'][:8]} on `{e.data.get('branch', '')}`", "icon": "branch", "tone": "commit", "title": e.data.get("subject", ""), "at": seconds(e.created_at), "state": "", "detail": ""}
                for e in entries if e.kind == "commit"]

    @staticmethod
    def feature_cards(entries) -> list[dict]:
        """The marks features showed through the cards funnel, as the chat draws them."""
        return [{"key": e.data["key"], "label": e.data["label"], "icon": e.data["icon"], "tone": e.data.get("tone", ""), "title": e.data.get("detail", ""), "detail": e.data.get("detail", ""), "row": e.data.get("row", ""), "at": e.data.get("at") or seconds(e.created_at), "state": "", "settled": ""}
                for e in entries if e.kind == "card"]

    def row(self, a, entries) -> V3Row:
        hooks = [e for e in entries if e.kind not in ("nudge", "created", "updated", "deleted", "commit")]
        last = hooks[-1] if hooks else None
        kind = last.kind if last else ""
        status = "stopped" if a.state == "ended" else STATUS.get(kind, "idle")
        at = seconds(last.created_at) if last else seconds(a.updated_at)
        state = self.states.named(a.state, a.data)
        data = {
            "status": status, "event": EVENT.get(kind, kind), "tool": last.data.get("tool_name", "") if last and kind == "ToolStarting" else "", "file": "", "at": at,
            "provider": a.provider, "model": "", "context": a.context_mark, "started": seconds(a.created_at), "asking": {} if a.state != "waiting" else {"n": a.data.get("question_id", 0)},
            "doing": self.doing(a, state), "last_message": next((e.data.get("delta", "") for e in reversed(hooks) if e.kind == "TurnWritten"), ""),
            "cards": sorted([*self.commit_cards(entries), *self.feature_cards(entries)], key=lambda c: c["at"]), "whispers": [], "skills": list((a.skills_loaded or {}).keys()), "skill_loads": [], "compactions": [{"at": seconds(e.created_at)} for e in hooks if e.kind == "Compacting"],
            "subagent_rows": self.subagent_rows(hooks), "shell_rows": [], "monitor_rows": [], "commands": [], "parent": "", "halted": a.data.get("why", "") if a.state == "halted" else "", "state": a.state,
        }
        return V3Row.of("agent", a, title=a.session, seen=[SYSTEM, AGENT], data=data)

    @staticmethod
    def subagent_rows(hooks) -> list[dict]:
        """Each dispatch of a subagent, from the Agent tool's start and finish, as the chat draws its start and end marks."""
        rows, open_ = [], []
        for e in hooks:
            if e.data.get("tool_name") not in ("Agent", "Task"):
                continue
            given = e.data.get("tool_input", {})
            if e.kind == "ToolStarting":
                rows.append({"id": f"sub:{e.id}", "at": seconds(e.created_at), "task": given.get("description", "") or given.get("prompt", "")[:80], "type": given.get("subagent_type", "") or "subagent", "model": given.get("model", ""), "session": "", "status": "running", "ended": 0, "refusal": ""})
                open_.append(rows[-1])
            elif e.kind == "ToolFinished" and open_:
                done = open_.pop(0)
                done.update(status="done", ended=seconds(e.created_at))
        return rows

    @staticmethod
    def doing(a, state) -> str:
        if a.state == "working" or a.state == "following_plan":
            return f"task {a.data.get('task_id', '')}"
        return a.state.replace("_", " ") if a.state != "idle" else ""

    @staticmethod
    def cards(hooks) -> list[dict]:
        cards = []
        for e in hooks:
            if e.kind != "ToolFinished" or e.data.get("tool_name") != "Bash" or "git commit" not in e.data.get("tool_input", {}).get("command", ""):
                continue
            output = str(e.data.get("tool_response", ""))
            found = COMMITTED.search(output)
            if not found:
                continue
            branch, sha, subject = found.groups()
            cards.append({"key": f"commit:{sha}", "label": f"Agent committed {sha[:8]} on `{branch}`", "icon": "branch", "tone": "commit", "title": subject, "at": seconds(e.created_at), "state": "", "detail": ""})
        return cards
