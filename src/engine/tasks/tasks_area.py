from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class TasksArea(EngineArea):
    summary = "Events for several tasks changing together."
    use = AreaUse.CONTRACT
