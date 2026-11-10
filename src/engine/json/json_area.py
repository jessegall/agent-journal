from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class JsonArea(EngineArea):
    summary = "JSON pointers, JSON schemas and settings files."
    use = AreaUse.CONTRACT
