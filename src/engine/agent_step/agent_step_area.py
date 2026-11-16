from engine.area.engine_area import EngineArea
from engine.area.enums.area_use import AreaUse


class AgentStepArea(EngineArea):
    summary = "Reading an agent's view and saving its step: the contracts the drivers module binds, the result of a save and the codec of the stack's stacked states."
    use = AreaUse.CONTRACT
