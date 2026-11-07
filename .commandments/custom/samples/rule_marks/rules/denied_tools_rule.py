from core.base.driver.rule_answer import RuleAnswer


class ToolExclusionSample:
    def answer(self, hook):
        # @righteous architecture_drivers_block_outside_block_until
        return RuleAnswer.refused(hook.excluded_tool_nudge)
