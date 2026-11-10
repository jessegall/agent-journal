from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class CliArea(EngineArea):
    summary = "The command line: parsing a line, the default subcommands of a model and running a line on the console."
    use = AreaUse.CONTRACT
