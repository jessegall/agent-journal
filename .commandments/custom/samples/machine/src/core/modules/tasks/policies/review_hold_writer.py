from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.commands.block_agent.block_agent import BlockAgent


class ReviewHoldWriter:
    def __init__(self, repository, bus) -> None:
        self.repository, self.bus = repository, bus

    def held(self, agent_id, agent_message, condition, context):
        # @sin architecture_drivers_hold_opened_outside_the_step
        self.repository.save(AgentBlock(session_agent_id=agent_id, creator_id=agent_id, agent_message_key=agent_message.key), context)
        # @sin architecture_drivers_stack_row_written_outside_the_step
        self.repository.save(AgentStack(session_agent_id=agent_id), context)
        # @righteous architecture_drivers_hold_opened_outside_the_step
        return self.bus.dispatch(BlockAgent(agent_id, agent_message, condition), context)
