from engine.area.engine_area import EngineArea
from engine.enums.area_use import AreaUse


class AgentMachineArea(EngineArea):
    summary = "The agent machine's contracts: the decision record of a step, the view it reads, the driver of an agent type and what modules and providers contribute."
    use = AreaUse.CONTRACT
