from engine.agent_machine.contracts.policy import Policy
from core.modules.processes.support.process_agent_messages import OUTPUT_ENDED


class EndedLinePolicy(Policy):
    key = "samples.ended_line"

    def refusals(self, question, view):
        # @righteous architecture_processes_reading_message_outside_the_notices
        return OUTPUT_ENDED.agent_message(output=question.output)
