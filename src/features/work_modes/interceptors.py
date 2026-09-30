import re
from pathlib import Path

from engine.gates import DISPATCHING
from engine.reach import Reach
from features.parts import AgentContext, Canceler, ToolInterceptor
from features.work_modes.modes import ORCHESTRATOR, SOLO, mode_of
from providers.payload import WriteCall

HELPER_DISPATCH = re.compile(r"\bjournal\b.*\bhelper\s+dispatch\b")
REFUSED = "the user set this environment to solo: do the work yourself, with no subagents and no helpers"


class RefuseDispatchInSolo(Canceler):
    reach = Reach.MAIN
    event = DISPATCHING

    def cancel(self, context: AgentContext, data) -> str:
        return REFUSED if mode_of(context.record) == SOLO else ""


class RefuseHelperInSolo(ToolInterceptor):
    reach = Reach.MAIN

    def intercept(self, context: AgentContext, call) -> str:
        shell = context.provider.shell_command(call)
        return REFUSED if shell and HELPER_DISPATCH.search(shell) and mode_of(context.record) == SOLO else ""


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
