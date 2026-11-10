from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class TimeArea(EngineArea):
    summary = "The clock, timestamps, durations, deadlines and timings."
    use = AreaUse.CONTRACT
