from journal.engine.support.stack_history import StackHistory
from journal.engine.states.wait import Wait
from journal.engine.states_catalogue import StatesCatalogue
from journal.features.sequences.listeners.record_run_changes import RUN
from journal.features.shell.support.shell_record import PART_END, PART_START
from journal.features.tasks.states.working import Working
from journal.support.chain import Chain
from journal.support.context_file import ContextFile
from journal.http.agents.current_work import CurrentWork
from journal.http.agents.current_sequence import CurrentSequence
from journal.http.files.project_files import ProjectFiles
from journal.http.support.model_fields import ModelFields
from journal.models.agent import Agent
from journal.support.sequence_run import SequenceRun
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.support.agent_message import AgentMessage
from journal.support.file_edit import FileEdit
from journal.support.file_read import FileRead
from journal.support.file_write import FileWrite
from journal.support.undecoded_tool import UndecodedTool
from journal.support.skill_load import SkillLoad
from journal.support.subagent_dispatch import SubagentDispatch
from journal.support.user_question import UserQuestion

STATUS = {"Stop": "idle", "SessionStarted": "idle", "SessionEnded": "stopped", "Compacting": "compacting", "PromptSubmitted": "busy", "ToolStarting": "busy", "ToolFinished": "busy", "ToolFailed": "busy", "SubagentStarted": "busy", "SubagentEnded": "busy"}
WORKING = frozenset({"working", "following_plan", "delegating", "orchestrating_plan"})
ENTRY_COUNT = 400
HISTORY_ENTRIES = 5
OPERATION_VERBS = {FileRead.kind: "reading a file", FileEdit.kind: "editing files", FileWrite.kind: "writing a file", SubagentDispatch.kind: "waiting for a subagent", SkillLoad.kind: "reading a skill", AgentMessage.kind: "messaging an agent", UserQuestion.kind: "asking you"}
ENDED = "ended"


class AgentActivity:
    """An agent with what it is doing, read from the timeline: its status from its latest hook, the tool or shell part in hand, its latest thought, what it waits for, its model and context, and the sequence it runs."""

    def __init__(self, entries: Entries, states: StatesCatalogue, context: ContextFile, files: ProjectFiles, messages: Messages, current: CurrentWork) -> None:
        self.entries, self.states, self.context, self.files, self.messages, self.current = entries, states, context, files, messages, current

    def page(self, agents: list[Agent]) -> list[dict]:
        recent = list(reversed(self.entries.kind_entries_scoped(ENTRY_COUNT))) if any(item.state != ENDED for item in agents) else []
        return [self.row(item, [] if item.state == ENDED else [e for e in recent if e.data.get("session") == item.session or (e.actor and e.actor.id == item.session)]) for item in agents]

    @staticmethod
    def work(entry) -> str:
        return entry.recorded_call().get("work", "")

    def row(self, agent: Agent, entries) -> dict:
        hooks = [e for e in entries if e.kind not in ("nudge", "created", "updated", "deleted")]
        moves = [e for e in hooks if e.kind in STATUS]
        last = moves[-1] if moves else None
        kind = last.kind if last else ""
        state = self.states.restored(agent.state, agent.data)
        waiting_state, enabled = self.current.wait_text(agent)
        return {
            **ModelFields.build(agent),
            "status": "stopped" if agent.state == ENDED else self.status(agent.state, STATUS.get(kind, "idle")),
            "heard_at": last.created_at if last else agent.updated_at,
            "tool": last.data.get("tool_name", "") if last and kind in ("ToolStarting", "ToolFinished") else "",
            "tool_work": self.work(last) if last and kind in ("ToolStarting", "ToolFinished") else "",
            "tool_running": kind == "ToolStarting",
            "awaiting": waiting_state, "wait_refs": enabled, "awaiting_since": agent.updated_at if waiting_state else None,
            "model": self.context.model(agent.session), "effort": self.context.effort(agent.session), "usage": self.context.usage(agent.session),
            "branch": self.files.branch(), "context": round((self.context.build(agent.session) or 0) * 100),
            "question_id": agent.data.get("question_id", 0) if agent.state == "waiting" else 0,
            "doing": self.activity(state, [e for e in entries if e.kind in ("ToolStarting", "ToolFinished", PART_START, PART_END)]),
            "thinking": self.thinking(agent.session, hooks) if agent.state != ENDED else "",
            "last_message": next((e.data.get("delta", "") for e in reversed(hooks) if e.kind == "TurnDisplayed"), ""),
            "stuck": agent.data.get("why", "") if agent.state == "stuck" else "",
            "sequence": self.sequence(agent),
            "stack": self.stack(agent),
            "trail": [self.trail_entry(e) for e in [e for e in entries if e.kind == StackHistory.KIND][-HISTORY_ENTRIES:]],
            "sequence_history": [{"time": e.created_at, "text": f"Sequence {e.data['n']}, {e.data['title']}: {e.data['what']}"} for e in reversed([e for e in entries if e.kind == RUN])][:HISTORY_ENTRIES],
        }

    @staticmethod
    def status(state: str, reported: str) -> str:
        return "working" if state in WORKING and reported == "busy" else reported

    def thinking(self, session: str, hooks) -> str:
        thoughts = self.messages.thoughts(session, 1)
        if not thoughts:
            return ""
        saved = [e.created_at for e in hooks if e.kind == "TurnDisplayed"]
        later = [time for time in (saved[-1] if saved else None, self.entries.last_prompt(session)) if time is not None]
        return "" if any(time > thoughts[-1].created_at for time in later) else thoughts[-1].text

    @staticmethod
    def sequence(agent: Agent) -> CurrentSequence | None:
        runs = [SequenceRun.build(raw) for raw in agent.sequence_runs or ()]
        if not runs:
            return None
        run = runs[-1]
        return CurrentSequence(sequence_id=run.sequence_id, title=run.title, step=run.step + 1, steps=len(run.steps), text=run.text, blocks=run.blocks, subject=run.subject, waiting_runs=len(runs) - 1)

    def activity(self, state, hooks) -> str:
        last = hooks[-1] if hooks else None
        if last and last.kind == PART_START:
            return last.data["doing"]
        if last and last.kind == "ToolStarting":
            operation = last.recorded_call().get("operation", {})
            return OPERATION_VERBS.get(operation.get("kind", ""), f"using {operation['name']}" if operation.get("kind") == UndecodedTool.kind else "working")
        return self.described(state) or ("at work" if hooks else "")

    def described(self, state) -> str:
        if isinstance(state, Wait):
            return state.wait_description()[0]
        return state.focus if isinstance(state, Working) else ""

    def stack(self, agent: Agent) -> list[dict]:
        shown = []
        for state in reversed(self.states.stack(agent).states):
            awaits = state.wait_description()[0] if isinstance(state, Wait) else ""
            shown.append({"name": state.name, "title": self.states.title(state.name), "values": state.serialized(), "awaits": awaits})
        return shown

    @staticmethod
    def trail_entry(entry) -> dict:
        return {"time": entry.created_at, "before": [row["state"] for row in entry.data.get("before", [])], "after": [row["state"] for row in entry.data.get("after", [])], "cause": entry.data.get("cause", ""), "refused": entry.data.get("refused", ""), "line": entry.data.get("line", "")}
