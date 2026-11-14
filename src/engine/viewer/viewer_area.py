from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class ViewerArea(EngineArea):
    summary = "Declarations for the viewer: windows, buttons, inspectors and fields."
    use = AreaUse.CONTRACT
