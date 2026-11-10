from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class ConnectionArea(EngineArea):
    summary = "The connection to the server's socket and the check for an internet connection."
    use = AreaUse.CONTRACT
