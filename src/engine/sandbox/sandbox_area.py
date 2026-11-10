from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class SandboxArea(EngineArea):
    summary = "The sandbox of an agent and of a shell line."
    use = AreaUse.CONTRACT
