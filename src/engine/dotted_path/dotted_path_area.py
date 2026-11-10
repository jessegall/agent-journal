from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class DottedPathArea(EngineArea):
    summary = "A dotted path to a class, and loading the class it names."
    use = AreaUse.CONTRACT
