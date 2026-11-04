from core.base.driver.rule_answer import RuleAnswer


class SampleBlockRule:
    def answer(self, hook):
        if hook.is_late:
            # @sin architecture_drivers_block_outside_block_until
            return RuleAnswer.refused(hook.late_nudge)
        # @righteous architecture_drivers_block_outside_block_until
        return RuleAnswer.allowed()
