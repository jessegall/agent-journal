from core.base.driver.rule_answer import RuleAnswer


class ProgramAccessSample:
    def answer(self, hook):
        # @righteous architecture_drivers_BlocksThroughBlockUntilDetector
        return RuleAnswer.refused(hook.program_nudge)
