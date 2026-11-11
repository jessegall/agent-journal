from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class CommandArea(EngineArea):
    summary = "Commands, their handlers and the bus that runs them, with the approvals a person gives."
    use = AreaUse.CONTRACT
