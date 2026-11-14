from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class TextArea(EngineArea):
    summary = "Text helpers: explanations, search terms and digests."
    use = AreaUse.CONTRACT
