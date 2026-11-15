from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_stack.states.compacting import Compacting
from engine.command.command import Command
from engine.enums.agent_role import AgentRole
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.modules.workers.needs.compaction_needs import COMPACTION_STOP_RULE, DUE_CAUSE
from suites.coding.modules.workers.types.worker import Worker
from suites.coding.support.context_limit_check import ContextLimitCheck


class RequestCompactionEffect(Effect):
    """An admitted stop under a Compacting that is due asks for the compaction (doc 1310 section 4.10): the
    request is written in the step's save and its compact or clear line goes to the agent; a program that
    compacts by its own window is sent nothing, and a request already open is not asked again."""

    events = [HookEventName.STOP]
    timing = EffectTiming.ON_ADMISSION
    agent_types = [AgentRole.MAIN, Worker.key]
    replaced_rules = tuple([COMPACTION_STOP_RULE])

    def __init__(self, limits: ContextLimitCheck) -> None:
        self.limits = limits

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        if not self.asks(view):
            return []
        # past the second limit the stop the hard limit asked for is what the compaction is for
        reason = CompactionReason.HARD_STOP if self.limits.exceeds_hard_limit(view.agent.agent_id) else CompactionReason.STOP_LIMIT
        return [CompactAgentContext(view.agent.agent_id, reason)]

    # the stop asks for the compaction: it is due and not running, and the program does not compact by its own window
    def asks(self, view: AgentView) -> bool:
        compacting = next((need.state for need in view.needs if isinstance(need.state, Compacting)), None)
        return compacting is not None and not compacting.is_running and compacting.cause == DUE_CAUSE and not self.limits.has_windowed_compaction(view.agent.agent_id)
