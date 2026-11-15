from engine.area.engine_area import EngineArea
from engine.enums.area_use import AreaUse


class AgentStackArea(EngineArea):
    summary = "An agent's continuation stack: its seven states, its frames, the reasons they give and the answer basis a step saves against."
    use = AreaUse.CONTRACT
