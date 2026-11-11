from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class ChatArea(EngineArea):
    summary = "Declarations of chat marks, their buttons and docked items."
    use = AreaUse.CONTRACT
