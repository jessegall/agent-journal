from engine.agent_machine.contracts.policy import Policy
from core.modules.processes.support.process_agent_messages import READER_BLOCK


class ReaderBlockPolicy(Policy):
    key = "samples.reader-block"

    def refusals(self, question, view):
        # @sin architecture_processes_pressure_outside_the_enforcer
        return refused(READER_BLOCK.agent_message(output=question.output, request=question.request))


def refused(agent_message):
    return [agent_message]
