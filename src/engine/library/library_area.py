from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class LibraryArea(EngineArea):
    summary = "The team library: items, shares, lookups and what a show command adds from it."
    use = AreaUse.CONTRACT
