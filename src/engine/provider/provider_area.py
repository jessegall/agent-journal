from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class ProviderArea(EngineArea):
    summary = "Providers of agent programs: hooks, launches, models and the context window."
    use = AreaUse.CONTRACT
