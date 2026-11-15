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
    """Every open wait and stuck report of the agent ends when it uses a tool outside the journal: it went on
    working. The waits are the Waiting frames of this step's needs, also one opened since the last step."""

    events = [HookEventName.PRE_TOOL_USE]
    timing = EffectTiming.UNCONDITIONAL

    def commands(self, view: AgentView, record: "DecisionRecord") -> Sequence[Command[object]]:
        tool = record.action.tool()
        if tool is None or (tool.shell is not None and tool.shell.is_journal_line):
            return []
        waits = [required_state.key.subject.row_id for required_state in view.states if isinstance(required_state.state, Waiting) and required_state.key.subject is not None and required_state.key.subject.model == WAIT_SUBJECT]
        return [EndWait(wait_id, outcome=WENT_ON) for wait_id in sorted(waits)]
