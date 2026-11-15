from engine.area.engine_area import EngineArea
from engine.enums.area_use import AreaUse


class RuleBackedArea(EngineArea):
    summary = "Lines, policies and effects of the agent machine answered by an old driver rule, so today's texts and commands stay exact until each rule's body moves into its contribution."
    use = AreaUse.CONTRACT
