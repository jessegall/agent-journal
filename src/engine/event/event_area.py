from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class EventArea(EngineArea):
    summary = "Events: what a change to a row raises, the event log, event types and event patterns."
    use = AreaUse.CONTRACT
