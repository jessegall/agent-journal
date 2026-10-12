from pathlib import Path

from declaring.holds import Runs
from engine.gates import DISPATCHING
from engine.journal_calls import calls
from declaring.reach import Reach
from features.parts import AgentContext, Canceler, ToolInterceptor
from features.work_modes.details import BUILDER, ORCHESTRATOR, SOLO
from features.work_modes.modes import mode_of
from features.work_modes.share import share
from providers.payload import WriteCall

REFUSED = "the user set this environment to solo: do the writing yourself; only a subagent that reads, such as Explore or Plan, may be dispatched, and no helper"


class RefuseDispatchInSolo(Canceler):
    reach = Reach.MAIN
    event = DISPATCHING

    def cancel(self, context: AgentContext, data) -> str:
        return REFUSED if mode_of(context.record) == SOLO and not data.read_only else ""


class RefuseHelperInSolo(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.SYNC

    def intercept(self, context: AgentContext, call) -> str:
        shell = call.shell_command
        if not shell or mode_of(context.record) != SOLO:
            return ""
        return REFUSED if any(made.names("helper", "dispatch") for made in calls(shell)) else ""


def orchestrator_drifted(context: AgentContext, edits: int) -> None:
    """An orchestrating agent that writes code itself is told how much of it it has written."""
    context.agent.whisper("drifted", edits=edits)


def builder_handed_away(context: AgentContext, edits: int) -> None:
    """A building agent is told when the greater part of the stretch's edits came from its helpers and subagents."""
    own, theirs = share(context.record)
    made = own + theirs
    if not made or own * 100 >= int(context.settings.own_share) * made:
        return
    context.agent.whisper("handed away", share=int(own * 100 / made), own=own, theirs=theirs)


DRIFTS = {ORCHESTRATOR: orchestrator_drifted, BUILDER: builder_handed_away}


class NameTheDrift(ToolInterceptor):
    """Every so many edits an agent makes itself, it is told if it has drifted out of the mode it works in."""
    reach = Reach.MAIN
    runs = Runs.ASYNC

    def intercept(self, context: AgentContext, call) -> str:
        mode = mode_of(context.record)
        drifted = DRIFTS.get(mode)
        if not isinstance(call, WriteCall) or drifted is None:
            return ""
        if Path(call.file_path).resolve().is_relative_to(context.record.root.resolve()):
            return ""
        counted = f"edits.{mode}"
        edits = int(context.state.get(counted, 0)) + 1
        if edits < int(context.settings.drift_after):
            context.state.set(counted, edits)
            return ""
        context.state.set(counted, 0)
        drifted(context, edits)
        return ""
