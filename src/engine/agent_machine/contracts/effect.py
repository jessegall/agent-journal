from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import TYPE_CHECKING, ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.command.command import Command
from engine.driver.nudge_declaration import NudgeDeclaration
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
    # the old driver rules this contribution answers for, which stand down once its slice is in force for the agent
    replaced_rules: ClassVar[Sequence[str]] = ()
    timing: ClassVar[EffectTiming]
    is_required: ClassVar[bool] = False
    failure: ClassVar[type[NudgeDeclaration] | None] = None

    @abstractmethod
    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]: ...
