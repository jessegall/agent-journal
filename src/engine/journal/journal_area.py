from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class JournalArea(EngineArea):
    summary = "The journal and its home folder."
    use = AreaUse.CONTRACT
