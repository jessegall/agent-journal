from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class ScriptArea(EngineArea):
    summary = "The record of a plugin script that was left out, and why."
    use = AreaUse.INTERNAL
