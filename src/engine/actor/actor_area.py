from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class ActorArea(EngineArea):
    summary = "Who acts on the journal: the actor a command carries, and the check that an actor is a user."
    use = AreaUse.CONTRACT
