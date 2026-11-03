from core.base.driver.rule_answer import RuleAnswer


class CommandAccessSample:
    def answer(self, hook):
        # @righteous architecture_drivers_BlocksThroughBlockUntilDetector
        return RuleAnswer.refused(hook.command_nudge)
