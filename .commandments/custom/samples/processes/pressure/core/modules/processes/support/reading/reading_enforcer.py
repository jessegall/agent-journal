from engine.driver.rule_answer import RuleAnswer
from engine.driver.block_until import BlockUntil
from core.modules.processes.support.process_nudges import READER_BLOCK


class ReadingEnforcer:
    def refusal(self, output: int, request: int) -> RuleAnswer:
        # @righteous architecture_processes_pressure_outside_the_enforcer
        return RuleAnswer.refused(READER_BLOCK.nudge(output=output, request=request))

    def block(self, agent_id: int, nudge, ends) -> BlockUntil:
        # @righteous architecture_processes_pressure_outside_the_enforcer
        return BlockUntil(agent_id, nudge, ends)
