from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class CheckArea(EngineArea):
    summary = "The conditions a step or a periodic check tests."
    use = AreaUse.CONTRACT
