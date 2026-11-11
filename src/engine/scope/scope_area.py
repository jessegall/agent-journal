from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class ScopeArea(EngineArea):
    summary = "Scopes: which rows an actor or an environment may read."
    use = AreaUse.CONTRACT
