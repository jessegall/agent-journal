from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.support.process_nudges import READER_REQUEST_SPAN
from core.modules.processes.support.reading.reader_request_blocks import ReaderRequestBlocks

READER_REQUEST_KEY = "processes.reader-request"


class ReaderRequestNeeds(NeedSource):
    """Holds the main agent's tools, after the request's tool uses, until it helps with each reader request whose
    saves failed or that expired."""

    replaced_rules = tuple([READER_REQUEST_KEY])
    state_type = Blocked
    rank = READER_REQUEST_KEY

    def __init__(self, blocks: ReaderRequestBlocks) -> None:
        self.blocks = blocks

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        if question.event is None or question.event.event is HookEventName.TICK:
            return {}
        holds = {agent.agent_id: self.blocks.answer(question.event, agent.agent_id).holds for agent in agents}
        return {agent_id: [BlockPlan(hold.nudge, hold.condition, READER_REQUEST_KEY, READER_REQUEST_KEY, tool_grace_uses=READER_REQUEST_SPAN.count, scope_tools=True, scope_stop=False)
                           for hold in agent_holds] for agent_id, agent_holds in holds.items() if agent_holds}
