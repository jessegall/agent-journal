from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class QueryArea(EngineArea):
    summary = "Queries: conditions, filters, pages and shared rows."
    use = AreaUse.CONTRACT
