from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class ExecutionArea(EngineArea):
    summary = "Who asks for an execution and how urgent it is, so every execution waits its turn in one order."
    use = AreaUse.CONTRACT
