from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class SeedArea(EngineArea):
    summary = "Seeders and the demo data."
    use = AreaUse.CONTRACT
