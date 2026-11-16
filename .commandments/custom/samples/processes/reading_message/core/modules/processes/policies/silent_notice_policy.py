from engine.agent_machine.contracts.policy import Policy
from core.modules.processes.support.process_agent_messages import RUN_SPARSE


class SilentNoticePolicy(Policy):
    key = "samples.silent_notice"

    def refusals(self, question, view):
        # @sin architecture_processes_reading_message_outside_the_notices
        return RUN_SPARSE.agent_message(output=question.output, seconds=question.seconds, hint="")
