from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.support.process_nudges import READER_BLOCK


class ReaderBlockRule(DriverRule):
    name = "samples.reader-block"

    def answer(self, hook):
        # @sin architecture_processes_pressure_outside_the_enforcer
        return RuleAnswer.refused(READER_BLOCK.nudge(output=hook.output, request=hook.request))
