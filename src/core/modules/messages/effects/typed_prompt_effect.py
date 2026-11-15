from engine.rule_backed.rule_effect import RuleEffect
from core.modules.messages.rules.typed_prompt_rule import TypedPromptRule


class TypedPromptEffect(RuleEffect):
    """The effect that keeps a prompt typed in the terminal, as today's TypedPromptRule runs it."""

    rule = TypedPromptRule
