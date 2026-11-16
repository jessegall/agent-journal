from collections.abc import Sequence

from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.decision_record import DecisionRecord
from engine.command.command import Command
from engine.request.request_values import RequestValues


class EffectCommands:
    """The commands an effect runs at one step, asked of it once a request: the answer that names them and the write
    that runs them read the same, since an effect may take what it reads, such as transcript rows read once."""

    def __init__(self, request_values: RequestValues) -> None:
        self.request_values = request_values

    def commands(self, effect: Effect, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        event = record.action.event
        event_id = event.event_id if event is not None else "step"
        key = f"drivers.effect-commands:{type(effect).__name__}:{view.agent.agent_id}:{event_id}"
        return self.request_values.read(key, lambda: event_id, lambda: tuple(effect.commands(view, record)))
