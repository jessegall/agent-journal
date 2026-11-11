from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class CallerArea(EngineArea):
    summary = "Who runs a command line: the caller, its request and the chain of processes it came through."
    use = AreaUse.CONTRACT
