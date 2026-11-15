from collections.abc import Sequence
from typing import TYPE_CHECKING

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_stack.states.waiting import Waiting
from engine.command.command import Command
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from core.modules.waits.commands.end_wait.end_wait import EndWait

if TYPE_CHECKING:
    from engine.agent_machine.decision_record import DecisionRecord

WAIT_SUBJECT = "waits"
# the key the wait's end is recorded under
WORK_ENDS_WAIT_KEY = "waits.work-ends-wait"
WENT_ON = "the agent went on working"


class WorkEndsWaitEffect(Effect):
    """A wait or a stuck report ends when the agent uses a tool outside the journal: it went on working. The
    wait is the Waiting frame this step puts on top of its work lane."""

    events = [HookEventName.PRE_TOOL_USE]
    timing = EffectTiming.UNCONDITIONAL

    def commands(self, view: AgentView, record: "DecisionRecord") -> Sequence[Command[object]]:
        tool = record.action.tool()
        if tool is None or (tool.shell is not None and tool.shell.is_journal_line):
            return []
        # the wait this step's needs put on top of the work lane: the newest open one, also when it opened since the last step
        waits = [need.key.subject.row_id for need in view.needs if isinstance(need.state, Waiting) and need.key.subject is not None and need.key.subject.model == WAIT_SUBJECT]
        return [EndWait(max(waits), outcome=WENT_ON)] if waits else []
