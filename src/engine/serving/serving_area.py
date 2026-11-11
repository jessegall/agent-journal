from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class ServingArea(EngineArea):
    summary = "What the server and the installer share: the server's files and limits, the handover of code, the update steps."
    use = AreaUse.CONTRACT
