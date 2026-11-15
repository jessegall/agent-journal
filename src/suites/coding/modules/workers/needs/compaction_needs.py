from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.states.compacting import Compacting
from engine.enums.agent_role import AgentRole
from engine.time.clock import Clock
from core.modules.drivers.models.enums.compaction_state import CompactionState
from core.modules.drivers.support.context_compactions import ContextCompactions
from suites.coding.modules.workers.types.worker import Worker
from suites.coding.support.context_limit_check import ContextLimitCheck

COMPACTION_STOP_RULE = "drivers.compaction-due-stop"
DUE_CAUSE = "due"
RETRY_ATTEMPT, FIRST_ATTEMPT = 2, 1


class CompactionNeeds(StateSource):
    """Compacting on the stack of a main agent or a worker (doc 1310 section 4.10): while the journal's request
    is open, asked within its retry time or started, and while compaction is due and the journal may still
    ask, once and once more when the first did not start in time. A failed compaction asks no more until a
    person or the program compacts. Due is ContextLimitCheck: past the limit and grown enough, with
    no task to finish first or past the second limit."""
    state_type = Compacting
    rank = ""
    agent_types = [AgentRole.MAIN, Worker.key]

    def __init__(self, compactions: ContextCompactions, limits: ContextLimitCheck, clock: Clock) -> None:
        self.compactions, self.limits, self.clock = compactions, limits, clock

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        needs = {agent.agent_id: self.compacting(agent.agent_id) for agent in agents if agent.agent_type in self.agent_types}
        return {agent_id: [need] for agent_id, need in needs.items() if need is not None}

    def compacting(self, agent_id: int) -> RequiredState | None:
        open_compaction = self.compactions.open_compaction(agent_id)
        if open_compaction is not None and open_compaction.is_open_at(self.clock.timestamp()):
            attempt = RETRY_ATTEMPT if open_compaction.is_retry else FIRST_ATTEMPT
            return self.need(open_compaction.id, open_compaction.reason.value, attempt, open_compaction.state is CompactionState.STARTED)
        if self.compactions.blocks_request(agent_id, self.clock.timestamp()) or not self.limits.needs_compaction(agent_id):
            return None
        newest = self.compactions.newest(agent_id)
        attempt = RETRY_ATTEMPT if newest is not None and newest.state is CompactionState.REQUESTED else FIRST_ATTEMPT
        return self.need(newest.id if newest is not None else 0, DUE_CAUSE, attempt, False)

    def need(self, generation: int, cause: str, attempt: int, is_running: bool) -> RequiredState:
        return RequiredState(Compacting(generation, cause, attempt, is_running), self.rank, StateKey("Compacting", None, f"compaction:{generation}"))
