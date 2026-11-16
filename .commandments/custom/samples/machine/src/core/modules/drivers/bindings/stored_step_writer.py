from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.agent_stack import AgentStack


class StoredStepWriter:
    def saved(self, agent_id, plan, context):
        # @righteous architecture_drivers_hold_opened_outside_the_step
        self.repository.save(AgentBlock(session_agent_id=agent_id, creator_id=agent_id, agent_message_key=plan.key), context)
        # @righteous architecture_drivers_stack_row_written_outside_the_step
        return self.repository.save(AgentStack(session_agent_id=agent_id), context)
