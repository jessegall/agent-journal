from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class PerformanceArea(EngineArea):
    summary = "Developer tools that measure how fast the journal runs."
    use = AreaUse.CONTRACT
