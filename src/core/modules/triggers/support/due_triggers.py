from engine.database.database import Database
from engine.driver.hook_event import HookEvent
from engine.request.request_values import RequestValues
from engine.time.clock import Clock
from core.modules.drivers.support.minute_tick import MinuteTick
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.queries.trigger_query import TriggerQuery
from core.modules.triggers.support.trigger_conditions import TriggerConditions


class DueTriggers:
    """The scheduled triggers whose time has come and that pass their conditions for the main agent's hook: read once
    a hook, so the lines that give their text and the effect that moves them on agree."""

    def __init__(self, triggers: TriggerQuery, conditions: TriggerConditions, clock: Clock, minute_tick: MinuteTick, request_values: RequestValues, database: Database) -> None:
        self.triggers, self.conditions, self.clock, self.minute_tick = triggers, conditions, clock, minute_tick
        self.request_values, self.database = request_values, database

    # at the agent's minute step the conditions read the tick that step replaces
    def due(self, event: HookEvent | None, agent_id: int) -> list[Trigger]:
        event = event if event is not None else self.minute_tick.event(agent_id)
        return self.request_values.read(f"triggers.due:{agent_id}:{event.firing}", self.database.change_mark,
                                        lambda: [trigger for trigger in self.triggers.due(self.clock.timestamp()) if self.conditions.all_pass(trigger, event, agent_id)])
