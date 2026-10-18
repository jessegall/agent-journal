from journal.http.v3.shapers.sequence_in_hand import SequenceInHand
from journal.engine.states.paused import Paused
from journal.engine.states_catalogue import StatesCatalogue
from journal.features.sequences.listeners.record_run_changes import RUN
from journal.features.shell.commands.shell_command import RAN, RUNNING
from journal.features.tasks.states.working import Working
from journal.features.thinking.thoughts import Thoughts
from journal.features.workers.subagents import Subagents
from journal.hooks.context_file import ContextFile
from journal.http.v3.project_files import ProjectFiles
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, SYSTEM, V3Row, seconds
from journal.models.sequence_run import SequenceRun
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries

STATUS = {"Idle": "idle", "SessionStarted": "idle", "SessionEnded": "stopped", "Compacting": "compacting", "PromptSubmitted": "busy", "ToolStarting": "busy", "ToolFinished": "busy", "SubagentStarted": "busy", "SubagentEnded": "busy"}
WORKING = frozenset({"working", "following_plan"})
"""The states in which the agent has declared its work: only then is it working; an agent merely running is busy."""
EVENT = {"ToolStarting": "PreToolUse", "ToolFinished": "PostToolUse", "PromptSubmitted": "UserPromptSubmit", "Idle": "Stop", "SessionStarted": "SessionStart", "SessionEnded": "SessionEnd", "Compacting": "PreCompact"}
PAUSED = frozenset({"waiting", "awaiting", "stuck"})
KEPT = 400
HISTORY = 5
"""How many of an agent's latest sequence changes its panel shows."""
TOOL_VERBS = {"Read": "reading a file", "Edit": "editing a file", "Write": "writing a file", "MultiEdit": "editing files", "Grep": "searching", "Glob": "finding files", "Agent": "waiting for a subagent", "WebFetch": "fetching a page", "WebSearch": "searching the web", "Skill": "reading a skill"}


class AgentsShaper(Shaper):
    """An agent row as version 3 kept it: its status from its latest entry, and on its data the commits, skills and compactions the chat draws, read from the timeline."""

    type = "agent"

    def __init__(self, agents: Agents, entries: Entries, states: StatesCatalogue, context: ContextFile, files: ProjectFiles, thoughts: Thoughts, subagents: Subagents) -> None:
        self.agents, self.entries, self.states, self.context, self.files, self.thoughts, self.subagents = agents, entries, states, context, files, thoughts, subagents

    def rows(self) -> list[V3Row]:
        recent = list(reversed(self.entries.of_kind_in(KEPT)))
        return [self.row(a, [e for e in recent if e.data.get("session") == a.session or (e.actor and e.actor.id == a.session)]) for a in self.agents.in_()]

    @staticmethod
    def commit_cards(entries) -> list[dict]:
        return [{"key": f"commit:{e.data['sha']}", "label": f"Agent committed {e.data['sha'][:8]} on `{e.data.get('branch', '')}`", "icon": "branch", "tone": "commit", "title": e.data.get("subject", ""), "at": seconds(e.created_at), "state": "", "detail": ""}
                for e in entries if e.kind == "commit"]

    @staticmethod
    def status_of(state: str, heard: str) -> str:
        """A live agent's status: working when its state is one of work and its last hook says it is busy, else what the hook says."""
        return "working" if state in WORKING and heard == "busy" else heard

    def row(self, a, entries) -> V3Row:
        hooks = [e for e in entries if e.kind not in ("nudge", "created", "updated", "deleted", "commit")]
        moves = [e for e in hooks if e.kind in STATUS]
        last = moves[-1] if moves else None
        kind = last.kind if last else ""
        status = "stopped" if a.state == "ended" else self.status_of(a.state, STATUS.get(kind, "idle"))
        at = seconds(last.created_at) if last else seconds(a.updated_at)
        state = self.states.named(a.state, a.data)
        data = {
            "status": status, "event": EVENT.get(kind, kind), "tool": last.data.get("tool_name", "") if last and kind in ("ToolStarting", "ToolFinished") else "", "file": "", "at": at,
            "provider": a.provider, "model": self.context.model(a.session), "effort": self.context.effort(a.session), "usage": {"windows": self.context.usage(a.session)}, "branch": self.files.branch(), "context": round((self.context.of(a.session) or 0) * 100), "started": seconds(a.created_at), "asking": {} if a.state != "waiting" else {"n": a.data.get("question_id", 0)},
            "doing": self.doing(a, state, [e for e in entries if e.kind in ("ToolStarting", "ToolFinished", RUNNING, RAN)]), "thinking": self.thoughts.latest(a.session), "last_message": next((e.data.get("delta", "") for e in reversed(hooks) if e.kind == "TurnWritten"), ""),
            "cards": self.commit_cards(entries), "skills": list((a.skills_loaded or {}).keys()), "skill_loads": [], "compactions": [{"at": seconds(e.created_at)} for e in hooks if e.kind == "Compacting"],
            "subagent_rows": (subagents := self.subagents.rows(a.session)), "subagents": len(subagents), "shell_rows": [], "monitor_rows": [], "commands": [], "parent": "", "stuck": a.data.get("why", "") if a.state == "stuck" else "", "state": a.state,
            "sequence": self.sequence_of(a), "sequence_history": [self.change_of(e) for e in reversed([e for e in entries if e.kind == RUN])][:HISTORY],
        }
        return V3Row.of("agent", a, title=a.session, seen=[SYSTEM, AGENT], data=data)

    @staticmethod
    def sequence_of(a) -> SequenceInHand | None:
        """The run in hand, as the agent's panel shows it: the step, and what it holds."""
        runs = [SequenceRun.of(raw) for raw in a.sequence_runs or ()]
        if not runs:
            return None
        run = runs[-1]
        return SequenceInHand(n=run.sequence_id, title=run.title, step=run.step + 1, steps=len(run.steps), text=run.text, holds=run.holds, about=run.about, under=len(runs) - 1)

    @staticmethod
    def change_of(entry) -> dict:
        return {"at": seconds(entry.created_at), "text": f"Sequence {entry.data['n']}, {entry.data['title']}: {entry.data['what']}"}

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
