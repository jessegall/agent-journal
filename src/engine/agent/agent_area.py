from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class AgentArea(EngineArea):
    summary = "What the engine knows of agents: groups, roles, policy, checkouts and where an agent may write."
    use = AreaUse.CONTRACT
