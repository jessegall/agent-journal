from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.record.question import Question
from engine.agent_stack.reason import Reason
from engine.command.command import Command
from engine.driver.shell_line import ShellLine
from engine.enums.agent_role import AgentRole
from engine.enums.command_category import CommandCategory
from engine.enums.decision_class import DecisionClass
from engine.enums.grant_type import GrantType
from engine.setting.setting_values import SettingValues
from suites.coding.support.auto_advice import AutoAdvice


class JournalCommandAllowance(Policy):
    """A journal command the main agent runs only while a setting allows it (doc 1310 section 10.9): asked at
    the hook of a line that runs the command and at the command's entrance, with one text, so the CLI,
    MCP and the hook refuse alike. A subclass names its command words, its setting and its text."""

    arguments: ClassVar[tuple[str, ...]]
    setting: ClassVar[str]
    rank = "workers.policies"
    agent_types = [AgentRole.MAIN]
    grant_types = [GrantType.REFUSAL_SKIP]

    def __init__(self, settings: SettingValues, guidance: AutoAdvice) -> None:
        self.settings, self.guidance = settings, guidance

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        tool = question.tool()
        return self.refusal() if tool is not None and self.runs_command(tool.shell, self.arguments) else []

    # a shell line runs the journal command when one of its parts opens with the command's words
    @staticmethod
    def runs_command(shell: ShellLine | None, arguments: tuple[str, ...]) -> bool:
        return shell is not None and any(part.classification.category is CommandCategory.JOURNAL and tuple(part.arguments[:len(arguments)]) == arguments for part in shell.parts)

    def entry_point_refusals(self, command: Command[object], agent: AgentReference) -> Sequence[Reason]:
        return self.refusal()

    def refusal(self) -> list[Reason]:
        if self.settings.value(self.setting) is not False:
            return []
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, self.refusal_text())]

    def refusal_text(self) -> str:
        raise NotImplementedError(f"{type(self).__name__} names no refusal text")
