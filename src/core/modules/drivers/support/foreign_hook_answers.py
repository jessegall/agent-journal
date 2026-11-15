from collections.abc import Sequence
from dataclasses import dataclass, field

from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.command import Command
from engine.driver.project_hook_answer import ProjectHookAnswer
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.provider.providers import Providers
from engine.query.conditions.contains_some import ContainsSome
from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.nudges.managed_hook_line_message import ManagedHookLineMessage
from core.modules.drivers.nudges.managed_hook_refusal_message import ManagedHookRefusalMessage

MANAGED_HOOKS_KEY = "drivers.managed-hooks"


@dataclass(frozen=True)
class ForeignHookAnswer:
    """What the project's own hooks answered one hook: the refusal they gave, the lines new since each last spoke,
    the notices that record them, the input one replaced and the hook that replaced it, the lines a hook that takes
    none dropped, and their terminal text."""

    refusal: AgentMessage | None
    nudges: tuple[AgentMessage, ...]
    commands: tuple[Command[object], ...]
    updated_input: dict[str, object] = field(default_factory=dict[str, object])
    source_name: str = ""
    dropped_lines: int = 0
    terminal: str = ""


class ForeignHookAnswers:
    """Project hooks contribute refusals, replacement input and lines alongside the journal's. The agent gets a hook's
    own words, and gets them again only once they change from what that hook last said to it. Read once a hook, so
    the policy, the lines, the effect and the rewrite share one answer."""

    def __init__(self, providers: Providers, queries: Queries, numbers: RowNumbers, request_values: RequestValues) -> None:
        self.providers, self.queries, self.numbers, self.request_values = providers, queries, numbers, request_values

    def answer(self, event: HookEvent, agent_id: int) -> ForeignHookAnswer:
        # read once a hook whatever changes meanwhile: the notices it records are what the next read compares with
        return self.request_values.read(f"drivers.foreign-hooks:{agent_id}:{event.firing}", lambda: event.firing, lambda: self.answered(event, agent_id))

    def answered(self, event: HookEvent, agent_id: int) -> ForeignHookAnswer:
        provider = self.providers.provider(event.program)
        answers = [ProjectHookAnswer.read(run) for run in event.foreign]
        refusal_text = next((answer.reason() for answer in answers if answer.refusal), "")
        rewritten = next((answer for answer in answers if answer.updated_input), None)
        # an event whose text the program reads as instructions, such as a compaction, gets a hook's words every time;
        # an event that takes lines gets them again only once they change from what that hook last said
        reads_text = provider.reads_hook_text(event.event)
        takes_instructions = reads_text and event.event not in provider.line_events
        lines = [line for answer in answers for line in (self.named_lines(answer.name, answer.lines) if takes_instructions else self.new_lines(agent_id, answer.name, answer.lines))]
        commands: list[Command[object]] = [RecordAgentNotice(agent_id, line, MANAGED_HOOKS_KEY) for line in lines] if reads_text else []
        nudges = [ManagedHookLineMessage.declared().nudge(line=line) for line in lines] if reads_text else []
        refusal = None
        if refusal_text:
            commands.append(RecordAgentNotice(agent_id, refusal_text, MANAGED_HOOKS_KEY))
            refusal = ManagedHookRefusalMessage.declared().nudge(agent=self.numbers.number(AGENT_MODEL_NAME, agent_id))
        return ForeignHookAnswer(refusal, tuple(nudges), tuple(commands), dict(rewritten.updated_input) if rewritten is not None else {}, rewritten.name if rewritten is not None else "",
                                 0 if reads_text else len(lines), "\n".join(answer.terminal for answer in answers if answer.terminal))

    @staticmethod
    def named_lines(name: str, reported: Sequence[str]) -> list[str]:
        return [f"{name}: {text}" for text in reported]

    def new_lines(self, agent_id: int, name: str, reported: Sequence[str]) -> list[str]:
        if not reported:
            return []
        prefix = f"{name}: "
        last = self.queries.query(HookCall).filter(session_agent_id=agent_id).matching(ContainsSome(["lines"], [prefix])).newest().first()
        previous_lines = last.lines.splitlines() if last is not None else []
        return [line for line in (f"{prefix}{text}" for text in reported) if line not in previous_lines]
