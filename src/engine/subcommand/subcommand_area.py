from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class SubcommandArea(EngineArea):
    summary = "Subcommands: arguments, output and how rows and values are printed."
    use = AreaUse.CONTRACT
