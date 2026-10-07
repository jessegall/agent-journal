from pathlib import Path

from engine.gates import DISPATCHING
from engine.journal_calls import calls
from engine.reach import Reach
from features.parts import AgentContext, Canceler, ToolInterceptor
from features.work_modes.details import ORCHESTRATOR, SOLO
from features.work_modes.modes import mode_of
from providers.payload import WriteCall

REFUSED = "the user set this environment to solo: do the writing yourself; only a subagent that reads, such as Explore or Plan, may be dispatched, and no helper"


class RefuseDispatchInSolo(Canceler):
    reach = Reach.MAIN
    event = DISPATCHING

    def cancel(self, context: AgentContext, data) -> str:
        return REFUSED if mode_of(context.record) == SOLO and not data.read_only else ""


class RefuseHelperInSolo(ToolInterceptor):
    reach = Reach.MAIN

    def intercept(self, context: AgentContext, call) -> str:
        shell = call.shell_command
        if not shell or mode_of(context.record) != SOLO:
            return ""
        return REFUSED if any(made.names("helper", "dispatch") for made in calls(shell)) else ""


class RemindOrchestrator(ToolInterceptor):
    reach = Reach.MAIN
    refuses = False

    def intercept(self, context: AgentContext, call) -> str:
        if not isinstance(call, WriteCall) or mode_of(context.record) != ORCHESTRATOR:
            return ""
        if Path(call.file_path).resolve().is_relative_to(context.record.root.resolve()):
            return ""
        edits = int(context.state.get("edits", 0)) + 1
        if edits < int(context.settings.drift_after):
            context.state.set("edits", edits)
            return ""
        context.state.set("edits", 0)
        context.agent.whisper("drifted", edits=edits)
        return ""
