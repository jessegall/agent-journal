from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class LogArea(EngineArea):
    summary = "The error log, the refusal log and the writer of the system log."
    use = AreaUse.CONTRACT
