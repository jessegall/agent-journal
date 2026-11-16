from engine.agent_machine.contracts.policy import Policy
from core.modules.processes.support.process_agent_messages import JOURNAL_COMMAND_LAST


class JournalLastPolicy(Policy):
    key = "samples.journal-last"

    def refusals(self, question, view):
        # @righteous architecture_processes_pressure_outside_the_enforcer
        return refused(JOURNAL_COMMAND_LAST.agent_message())


def refused(agent_message):
    return [agent_message]
