from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class ProcessArea(EngineArea):
    summary = "Child processes, processes left over from an earlier run and the processes of plugin scripts."
    use = AreaUse.CONTRACT
