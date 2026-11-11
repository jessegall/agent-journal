from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class ListenerArea(EngineArea):
    summary = "Listeners that run on a save, a deletion or a commit, and the runner of commit listeners."
    use = AreaUse.CONTRACT
