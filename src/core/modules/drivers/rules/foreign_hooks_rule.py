from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.foreign_answer import ForeignAnswer
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.provider.providers import Providers
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
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
        answers = [ForeignAnswer.read(run) for run in hook.event.foreign]
        refusal = next((answer.reason() for answer in answers if answer.refusal), "")
        rewritten = next((answer for answer in answers if answer.updated_input), None)
        lines = [f"{answer.name}: {line}" for answer in answers for line in answer.lines]
        commands = [RecordAgentNotice(hook.agent_id, line, self.name) for line in lines]
        nudges = [MANAGED_HOOK_LINE.nudge(agent=hook.agent_id)] if lines and hook.event.event in provider.line_events else []
        if hook.event.event not in provider.line_events:
            commands = []
        if refusal:
            commands.append(RecordAgentNotice(hook.agent_id, refusal, self.name))
            nudge = MANAGED_HOOK_REFUSAL.nudge(agent=hook.agent_id)
            refusal = nudge.text
            nudges = [*nudges, nudge]
        return RuleAnswer(refusal=refusal, nudges=nudges, commands=tuple(commands), updated_input=rewritten.updated_input if rewritten is not None else {},
                          source_name=rewritten.name if rewritten is not None else "", refusal_priority=-1,
                          dropped_lines=len(lines) if hook.event.event not in provider.line_events else 0,
                          terminal="\n".join(answer.terminal for answer in answers if answer.terminal))
