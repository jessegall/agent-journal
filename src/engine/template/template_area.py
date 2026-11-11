from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class TemplateArea(EngineArea):
    summary = "The declaration of a template."
    use = AreaUse.CONTRACT
