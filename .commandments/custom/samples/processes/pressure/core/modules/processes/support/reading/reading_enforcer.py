from engine.driver.rule_answer import RuleAnswer
from engine.driver.open_hold import OpenHold
from core.modules.processes.support.process_nudges import READER_BLOCK


class ReadingEnforcer:
    def refusal(self, output: int, request: int) -> RuleAnswer:
        # @righteous architecture_processes_pressure_outside_the_enforcer
        return RuleAnswer.refused(READER_BLOCK.agent_message(output=output, request=request))

    def block(self, agent_id: int, nudge, ends) -> OpenHold:
        # @righteous architecture_processes_pressure_outside_the_enforcer
        return OpenHold(agent_id, nudge, ends)
