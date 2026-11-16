from engine.area.engine_area import EngineArea
from engine.area.area_use import AreaUse


class AgentStackArea(EngineArea):
    summary = "An agent's continuation stack: its seven states, its stacked states, the reasons they give and the read versions a step saves against."
    use = AreaUse.CONTRACT
