from engine.enums.area_use import AreaUse
from engine.area.engine_area import EngineArea


class GitArea(EngineArea):
    summary = "Git reads of the project's files and of hook files."
    use = AreaUse.CONTRACT
