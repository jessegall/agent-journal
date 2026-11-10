from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class ModelArea(EngineArea):
    summary = "Models: rows with their states, lifecycles, scopes and positions."
    use = AreaUse.CONTRACT
