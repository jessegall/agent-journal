from journal.engine.support.trail import Trail
from journal.engine.states.wait import Wait
from journal.support.states_catalogue import StatesCatalogue
from journal.features.sequences.listeners.record_run_changes import RUN
from journal.features.shell.support.shell_record import RAN, RUNNING
from journal.features.tasks.states.working import Working
from journal.support.chain import Chain
from journal.support.context_file import ContextFile
from journal.http.agents.current_work import CurrentWork
from journal.http.agents.sequence_in_hand import SequenceInHand
from journal.http.files.project_files import ProjectFiles
from journal.http.support.model_fields import ModelFields
from journal.models.agent import Agent
from journal.support.sequence_run import SequenceRun
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages

STATUS = {"Idle": "idle", "SessionStarted": "idle", "SessionEnded": "stopped", "Compacting": "compacting", "PromptSubmitted": "busy", "ToolStarting": "busy", "ToolFinished": "busy", "ToolFailed": "busy", "SubagentStarted": "busy", "SubagentEnded": "busy"}
WORKING = frozenset({"working", "following_plan", "delegating", "orchestrating_plan"})
KEPT = 400
HISTORY = 5
TOOL_VERBS = {"Read": "reading a file", "Edit": "editing a file", "Write": "writing a file", "MultiEdit": "editing files", "Grep": "searching", "Glob": "finding files", "Agent": "waiting for a subagent", "WebFetch": "fetching a page", "WebSearch": "searching the web", "Skill": "reading a skill"}
ENDED = "ended"


class AgentActivity:
    """An agent with what it is doing, read from the timeline: its status from its latest hook, the tool or shell part in hand, its latest thought, what it waits for, its model and context, and the sequence it runs."""

    def __init__(self, entries: Entries, states: StatesCatalogue, context: ContextFile, files: ProjectFiles, messages: Messages, current: CurrentWork) -> None:
        self.entries, self.states, self.context, self.files, self.messages, self.current = entries, states, context, files, messages, current

    def page(self, agents: list[Agent]) -> list[dict]:
        recent = list(reversed(self.entries.of_kind_in(KEPT))) if any(a.state != ENDED for a in agents) else []
        return [self.of(a, [] if a.state == ENDED else [e for e in recent if e.data.get("session") == a.session or (e.actor and e.actor.id == a.session)]) for a in agents]

    @staticmethod
    def work_of(entry) -> str:
        return entry.recorded_call().get("work", "")

    def of(self, agent: Agent, entries) -> dict:
        hooks = [e for e in entries if e.kind not in ("nudge", "created", "updated", "deleted")]
        moves = [e for e in hooks if e.kind in STATUS]
        last = moves[-1] if moves else None
        kind = last.kind if last else ""
        state = self.states.named(agent.state, agent.data)
        awaiting, on = self.current.awaited(agent)
        return {
            **ModelFields.of(agent),
            "status": "stopped" if agent.state == ENDED else self.status_of(agent.state, STATUS.get(kind, "idle")),
            "heard_at": last.created_at if last else agent.updated_at,
            "tool": last.data.get("tool_name", "") if last and kind in ("ToolStarting", "ToolFinished") else "",
            "tool_work": self.work_of(last) if last and kind in ("ToolStarting", "ToolFinished") else "",
            "tool_running": kind == "ToolStarting",
            "awaiting": awaiting, "awaiting_on": on, "awaiting_since": agent.updated_at if awaiting else None,
            "model": self.context.model(agent.session), "effort": self.context.effort(agent.session), "usage": self.context.usage(agent.session),
            "branch": self.files.branch(), "context": round((self.context.of(agent.session) or 0) * 100),
            "question_id": agent.data.get("question_id", 0) if agent.state == "waiting" else 0,
            "doing": self.doing(state, [e for e in entries if e.kind in ("ToolStarting", "ToolFinished", RUNNING, RAN)]),
            "thinking": self.thinking(agent.session, hooks) if agent.state != ENDED else "",
            "last_message": next((e.data.get("delta", "") for e in reversed(hooks) if e.kind == "TurnWritten"), ""),
            "stuck": agent.data.get("why", "") if agent.state == "stuck" else "",
            "sequence": self.sequence_of(agent),
            "stack": self.stack_of(agent),
            "trail": [self.trail_entry(e) for e in [e for e in entries if e.kind == Trail.KIND][-HISTORY:]],
            "sequence_history": [{"time": e.created_at, "text": f"Sequence {e.data['n']}, {e.data['title']}: {e.data['what']}"} for e in reversed([e for e in entries if e.kind == RUN])][:HISTORY],
        }

    @staticmethod
    def status_of(state: str, reported: str) -> str:
        return "working" if state in WORKING and reported == "busy" else reported

    def thinking(self, session: str, hooks) -> str:
        thoughts = self.messages.thoughts_of(session, 1)
        if not thoughts:
            return ""
        written = [e.created_at for e in hooks if e.kind == "TurnWritten"]
        later = [time for time in (written[-1] if written else None, self.entries.last_prompt_of(session)) if time is not None]
        return "" if any(time > thoughts[-1].created_at for time in later) else thoughts[-1].text

    @staticmethod
    def sequence_of(agent: Agent) -> SequenceInHand | None:
        runs = [SequenceRun.of(raw) for raw in agent.sequence_runs or ()]
        if not runs:
            return None
        run = runs[-1]
        return SequenceInHand(sequence_id=run.sequence_id, title=run.title, step=run.step + 1, steps=len(run.steps), text=run.text, holds=run.holds, about=run.about, under=len(runs) - 1)

    def doing(self, state, hooks) -> str:
        last = hooks[-1] if hooks else None
        if last and last.kind == RUNNING:
            return last.data["doing"]
        if last and last.kind == "ToolStarting":
            return TOOL_VERBS.get(last.data.get("tool_name", ""), "working")
        return self.described(state) or ("at work" if hooks else "")

    def described(self, state) -> str:
        if isinstance(state, Wait):
            return state.awaiting()[0]
        return state.what if isinstance(state, Working) else ""

    def stack_of(self, agent: Agent) -> list[dict]:
        shown = []
        for state in reversed(self.states.stack_of(agent).states):
            awaits = state.awaiting()[0] if isinstance(state, Wait) else ""
            shown.append({"name": state.name, "title": self.states.title_of(state.name), "values": state.to_data(), "awaits": awaits})
        return shown

    @staticmethod
    def trail_entry(entry) -> dict:
        return {"time": entry.created_at, "before": [row["state"] for row in entry.data.get("before", [])], "after": [row["state"] for row in entry.data.get("after", [])], "cause": entry.data.get("cause", ""), "refused": entry.data.get("refused", ""), "line": entry.data.get("line", "")}
