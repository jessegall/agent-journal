from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class ModuleArea(EngineArea):
    summary = "Modules: the declaration, its checks, the sync into the registry and the layer rules."
    use = AreaUse.CONTRACT
