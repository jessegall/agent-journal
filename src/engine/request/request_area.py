from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class RequestArea(EngineArea):
    summary = "Values kept while one request is answered."
    use = AreaUse.CONTRACT
