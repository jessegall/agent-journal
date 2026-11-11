from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class VersionArea(EngineArea):
    summary = "The versions of the code and of the journal."
    use = AreaUse.CONTRACT
