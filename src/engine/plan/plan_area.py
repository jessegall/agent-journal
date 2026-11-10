from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class PlanArea(EngineArea):
    summary = "Who may write a plan."
    use = AreaUse.CONTRACT
