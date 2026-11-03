from core.base.driver.rule_answer import RuleAnswer


class SampleBlockRule:
    def answer(self, hook):
        if hook.is_late:
            # @sin architecture_drivers_BlocksThroughBlockUntilDetector
            return RuleAnswer.refused(hook.late_nudge)
        # @righteous architecture_drivers_BlocksThroughBlockUntilDetector
        return RuleAnswer.allowed()
