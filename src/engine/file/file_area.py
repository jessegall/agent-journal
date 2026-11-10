from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class FileArea(EngineArea):
    summary = "Reading and writing files in one place, with file versions, fingerprints and conflicts."
    use = AreaUse.CONTRACT
