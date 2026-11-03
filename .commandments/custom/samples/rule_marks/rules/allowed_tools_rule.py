from core.base.driver.rule_answer import RuleAnswer


class ToolAccessSample:
    def answer(self, hook):
        # @righteous architecture_drivers_BlocksThroughBlockUntilDetector
        return RuleAnswer.refused(hook.tool_nudge)
