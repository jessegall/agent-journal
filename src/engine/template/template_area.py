from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class TemplateArea(EngineArea):
    summary = "The declaration of a template."
    use = AreaUse.CONTRACT
