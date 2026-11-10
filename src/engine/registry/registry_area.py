from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class RegistryArea(EngineArea):
    summary = "The registry: everything the loaded modules declare, read from the database."
    use = AreaUse.CONTRACT
