from core.modules.processes.support.process_agent_messages import READER_REQUEST_COUNTDOWN
from collections.abc import Mapping, Sequence

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.support.process_agent_messages import READER_REQUEST_SPAN
from core.modules.processes.support.reading.reader_request_blocks import ReaderRequestBlocks

READER_REQUEST_KEY = "processes.reader-request"


class ReaderRequestStates(StateSource):
    """Holds the main agent's tools, after the request's tool uses, until it helps with each reader request whose
    saves failed or that expired."""
    state_type = Blocked
    rank = READER_REQUEST_KEY

    def __init__(self, blocks: ReaderRequestBlocks) -> None:
        self.blocks = blocks

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        if question.event is None or question.event.event is HookEventName.TICK:
            return {}
        block_plans = {agent.agent_id: self.blocks.answer(question.event, agent.agent_id).block_plans for agent in agents}
        return {agent_id: [BlockPlan(block_plan.agent_message, block_plan.condition, READER_REQUEST_KEY, READER_REQUEST_KEY, tool_grace_uses=READER_REQUEST_SPAN.count, scope_tools=True, scope_stop=False,
                                     countdown=READER_REQUEST_COUNTDOWN.agent_message("{left}", command=block_plan.command))
                           for block_plan in agent_block_plans] for agent_id, agent_block_plans in block_plans.items() if agent_block_plans}
