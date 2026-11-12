from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.support.process_nudges import JOURNAL_COMMAND_LAST


class JournalLastRule(DriverRule):
    name = "samples.journal-last"

    def answer(self, hook):
        # @righteous architecture_processes_pressure_outside_the_enforcer
        return RuleAnswer.refused(JOURNAL_COMMAND_LAST.nudge())
