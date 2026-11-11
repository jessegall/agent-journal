from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class ContainerArea(EngineArea):
    summary = "The container that builds a class with what it needs, and the container of one journal."
    use = AreaUse.CONTRACT
