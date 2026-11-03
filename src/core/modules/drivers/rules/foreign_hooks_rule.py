from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.foreign_answer import ForeignAnswer
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.provider.providers import Providers
from core.modules.drivers.support.driver_nudges import MANAGED_HOOK_LINE, MANAGED_HOOK_REFUSAL


class ForeignHooksRule(DriverRule):
    """Project hooks contribute refusals, replacement input and lines alongside the journal's rules."""

    name = "drivers.managed-hooks"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    essential = True

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        provider = self.providers.provider(hook.event.program)
        answers = [ForeignAnswer.read(provider, hook.event.event, run) for run in hook.event.foreign]
        refusal = next((answer.reason() for answer in answers if answer.refusal), "")
        rewritten = next((answer for answer in answers if answer.updated_input), None)
        lines = [MANAGED_HOOK_LINE.nudge(text=f"{answer.name}: {line}") for answer in answers for line in answer.lines]
        nudges = lines if hook.event.event in provider.line_events else []
        if refusal:
            nudge = MANAGED_HOOK_REFUSAL.nudge(text=refusal)
            refusal = nudge.text
            nudges = [*nudges, nudge]
        return RuleAnswer(refusal=refusal, nudges=nudges, updated_input=rewritten.updated_input if rewritten is not None else {},
                          source_name=rewritten.name if rewritten is not None else "", refusal_priority=-1,
                          dropped_lines=len(lines) if hook.event.event not in provider.line_events else 0,
                          terminal="\n".join(answer.terminal for answer in answers if answer.terminal))
