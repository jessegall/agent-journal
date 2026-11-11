from engine.driver.rule_answer import RuleAnswer


class DeclaredRefusalRule:
    single_action_refusal = "the tool is refused outright, never held until something becomes true"

    def answer(self, hook):
        # @righteous architecture_drivers_block_outside_block_until
        return RuleAnswer.refused(hook.tool_nudge)
