from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.watch import Watch
from core.modules.processes.queries.watch_query import WatchQuery


class WatchModelDeclaration(ModelDeclaration):
    """How the module declares Watch."""

    model = Watch
    query = WatchQuery
