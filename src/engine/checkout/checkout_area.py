from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class CheckoutArea(EngineArea):
    summary = "A checkout of the project and a file in it."
    use = AreaUse.CONTRACT
