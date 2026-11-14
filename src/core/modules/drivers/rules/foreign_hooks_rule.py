from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.foreign_answer import ForeignAnswer
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.provider.providers import Providers
from engine.query.conditions.contains_some import ContainsSome
from engine.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
from core.modules.drivers.support.driver_nudges import MANAGED_HOOK_LINE, MANAGED_HOOK_REFUSAL


class ForeignHooksRule(DriverRule):
    """Project hooks contribute refusals, replacement input and lines alongside the journal's rules. The agent gets a
    hook's own words, and on an event that takes lines gets them again only once they change from what that hook last
    said to it; on an event whose text the program reads as instructions, such as a compaction, they go every time."""

    name = "drivers.managed-hooks"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    essential = True

    def __init__(self, providers: Providers, queries: Queries, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.providers, self.queries = providers, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        provider = self.providers.provider(hook.event.program)
        answers = [ForeignAnswer.read(run) for run in hook.event.foreign]
        refusal = next((answer.reason() for answer in answers if answer.refusal), "")
        rewritten = next((answer for answer in answers if answer.updated_input), None)
        reads_text = provider.reads_hook_text(hook.event.event)
        takes_instructions = reads_text and hook.event.event not in provider.line_events
        lines = [line for answer in answers for line in (self.named_lines(answer.name, answer.lines) if takes_instructions else self.new_lines(hook, answer.name, answer.lines))]
        commands = [RecordAgentNotice(hook.agent_id, line, self.name) for line in lines] if reads_text else []
        nudges = [MANAGED_HOOK_LINE.nudge(line=line) for line in lines] if reads_text else []
        if refusal:
            commands.append(RecordAgentNotice(hook.agent_id, refusal, self.name))
            nudge = MANAGED_HOOK_REFUSAL.nudge(agent=self.numbers.number(AGENT_MODEL_NAME, hook.agent_id))
            refusal = nudge.text
            nudges = [*nudges, nudge]
        return RuleAnswer(refusal=refusal, nudges=nudges, commands=tuple(commands), updated_input=rewritten.updated_input if rewritten is not None else {},
                          source_name=rewritten.name if rewritten is not None else "", refusal_priority=-1,
                          dropped_lines=0 if reads_text else len(lines),
                          terminal="\n".join(answer.terminal for answer in answers if answer.terminal))

    @staticmethod
    def named_lines(name: str, reported: Sequence[str]) -> list[str]:
        return [f"{name}: {text}" for text in reported]

    def new_lines(self, hook: AgentHook, name: str, reported: Sequence[str]) -> list[str]:
        if not reported:
            return []
        prefix = f"{name}: "
        last = self.queries.query(HookCall).filter(session_agent_id=hook.agent_id).matching(ContainsSome(["lines"], [prefix])).newest().first()
        previous_lines = last.lines.splitlines() if last is not None else []
        return [line for line in (f"{prefix}{text}" for text in reported) if line not in previous_lines]
