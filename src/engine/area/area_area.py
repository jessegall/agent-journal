from engine.area.engine_area import EngineArea
from engine.enums.area_use import AreaUse


class AreaArea(EngineArea):
    summary = "The marker every engine area folder declares itself with: what the area is for and who may import it."
    use = AreaUse.CONTRACT
