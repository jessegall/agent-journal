from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class MapArea(EngineArea):
    summary = "The map of the code: one line for each top folder, engine area, module, suite and tunnel."
    use = AreaUse.CONTRACT
