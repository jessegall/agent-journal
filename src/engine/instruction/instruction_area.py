from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class InstructionArea(EngineArea):
    summary = "The imports in the instruction files of an agent."
    use = AreaUse.CONTRACT
