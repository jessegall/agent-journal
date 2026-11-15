from abc import abstractmethod
from collections.abc import Sequence
from typing import TYPE_CHECKING

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
    when it keeps time; its key is the old rule's name it replaces."""

    key: str
    timing = EffectTiming.UNCONDITIONAL

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        cls.replaced_rules = tuple([cls.key])
        cls.includes_steps = HookEventName.TICK in cls.events

    def commands(self, view: AgentView, record: "DecisionRecord") -> Sequence[Command[object]]:
        return self.commands_of(record.action.event, view.agent.agent_id)

    # the commands this event runs; no event is the agent's minute step
    @abstractmethod
    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]: ...
