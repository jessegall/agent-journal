from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class RepositoryArea(EngineArea):
    summary = "Saving and loading rows, with the check for a stale row."
    use = AreaUse.CONTRACT
