from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class PrivateArea(EngineArea):
    summary = "Private folders, secret values and the keys of the server."
    use = AreaUse.CONTRACT
