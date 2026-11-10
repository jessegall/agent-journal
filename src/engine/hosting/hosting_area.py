from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class HostingArea(EngineArea):
    summary = "Running the journal as a hosted service: the checks of the host, and hosted files."
    use = AreaUse.CONTRACT
