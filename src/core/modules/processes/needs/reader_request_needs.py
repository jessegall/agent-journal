from core.modules.processes.support.process_agent_messages import READER_REQUEST_COUNTDOWN
from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.support.process_agent_messages import READER_REQUEST_SPAN
from core.modules.processes.support.reading.reader_request_blocks import ReaderRequestBlocks

READER_REQUEST_KEY = "processes.reader-request"


class ReaderRequestNeeds(StateSource):
    """Holds the main agent's tools, after the request's tool uses, until it helps with each reader request whose
    saves failed or that expired."""
    state_type = Blocked
    rank = READER_REQUEST_KEY

    def __init__(self, blocks: ReaderRequestBlocks) -> None:
        self.blocks = blocks

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        if question.event is None or question.event.event is HookEventName.TICK:
            return {}
        holds = {agent.agent_id: self.blocks.answer(question.event, agent.agent_id).holds for agent in agents}
        return {agent_id: [BlockPlan(hold.agent_message, hold.condition, READER_REQUEST_KEY, READER_REQUEST_KEY, tool_grace_uses=READER_REQUEST_SPAN.count, scope_tools=True, scope_stop=False,
                                     countdown=READER_REQUEST_COUNTDOWN.agent_message("{left}", command=hold.command))
                           for hold in agent_holds] for agent_id, agent_holds in holds.items() if agent_holds}
