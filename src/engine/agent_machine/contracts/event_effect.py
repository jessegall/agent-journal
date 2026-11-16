from abc import abstractmethod
from collections.abc import Sequence
from typing import TYPE_CHECKING, ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.effect_timing import EffectTiming
from engine.enums.hook_event_name import HookEventName

if TYPE_CHECKING:
    from engine.agent_machine.decision_record import DecisionRecord


class EventEffect(Effect):
    """An effect that runs commands from the event alone, whatever the decision, or at the agent's minute step
    when it keeps time."""

    key: ClassVar[str]
    timing = EffectTiming.UNCONDITIONAL

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        cls.includes_steps = HookEventName.TICK in cls.events

    def commands(self, view: AgentView, record: "DecisionRecord") -> Sequence[Command[object]]:
        return self.effect_commands(record.action.event, view.agent.agent_id)

    # the commands this event runs; no event is the agent's minute step
    @abstractmethod
    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]: ...
