from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class ProfileArea(EngineArea):
    summary = "The profile of an agent and its name."
    use = AreaUse.CONTRACT
