from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class BookkeepingArea(EngineArea):
    summary = "The read commands of the event log and the refusal log."
    use = AreaUse.CONTRACT
