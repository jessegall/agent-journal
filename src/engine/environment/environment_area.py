from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class EnvironmentArea(EngineArea):
    summary = "The names of environments."
    use = AreaUse.CONTRACT
