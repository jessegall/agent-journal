from engine.enums.area_use import AreaUse
from engine.map.engine_area import EngineArea


class DatabaseArea(EngineArea):
    summary = "The database: tables, migrations, statements and the count of repeated work."
    use = AreaUse.CONTRACT
