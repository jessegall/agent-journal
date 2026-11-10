from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class RequestArea(EngineArea):
    summary = "The queue of requests and its entries."
    use = AreaUse.CONTRACT
