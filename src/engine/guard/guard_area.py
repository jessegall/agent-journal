from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class GuardArea(EngineArea):
    summary = "Guards that can refuse a change, their switches and the lifecycle guard."
    use = AreaUse.CONTRACT
