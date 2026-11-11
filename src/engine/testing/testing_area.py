from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class TestingArea(EngineArea):
    summary = "The test kit: the story builder, expectations, fakes and examples."
    use = AreaUse.INTERNAL
