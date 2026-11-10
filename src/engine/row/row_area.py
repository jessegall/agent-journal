from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class RowArea(EngineArea):
    summary = "What every row has: metadata, a page of rows and the owner of a row."
    use = AreaUse.CONTRACT
