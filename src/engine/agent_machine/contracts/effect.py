from engine.agent.enums.role_group import RoleGroup
from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence
from typing import TYPE_CHECKING, ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.command.command import Command
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.rule_answer import RuleAnswer
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName

if TYPE_CHECKING:
    from engine.agent_machine.decision_record import DecisionRecord


class Effect(ABC):
    """Work done in the save of a step that answers no question, on the events it names and at its timing; a
    required effect that fails withdraws the admission and says its failure line."""

    events: ClassVar[Sequence[HookEventName]]
    includes_steps: ClassVar[bool] = False
    agent_types: ClassVar[Sequence[str]] = ()
    # the group of agent types it holds for, read from the helper types as the old walk read a rule's
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY
    # the old driver rules this contribution answers for, which stand down once its slice is in force for the agent
    replaced_rules: ClassVar[Sequence[str]] = ()
    timing: ClassVar[EffectTiming]
    is_required: ClassVar[bool] = False
    # an effect that completes the agent's work, such as a helper's hand-in, belongs to its type's working slice
    completes_work: ClassVar[bool] = False
    failure: ClassVar[type[NudgeDeclaration] | None] = None

    @abstractmethod
    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]: ...

    # the tool input the action is run with once this effect's commands gave their results, such as a line wrapped in
    # the runner with the process its command made; none leaves the input as the transforms left it
    def input_after(self, view: AgentView, record: DecisionRecord, results: Sequence[object]) -> Mapping[str, object] | None:
        return None

    # what a required effect answers once its save failed and was rolled back, in a fresh write: by default the stop or
    # action is refused with its failure line
    def failed(self, view: AgentView, record: "DecisionRecord") -> RuleAnswer:
        return RuleAnswer(refusal=self.failure.declared().nudge().text if self.failure is not None else "")
