from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class TickerArea(EngineArea):
    summary = "Timed handlers: which are due and how often one runs."
    use = AreaUse.CONTRACT
