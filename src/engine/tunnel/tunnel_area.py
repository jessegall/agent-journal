from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class TunnelArea(EngineArea):
    summary = "The contract of a tunnel."
    use = AreaUse.CONTRACT
