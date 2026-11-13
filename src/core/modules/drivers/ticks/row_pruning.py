from engine.container.container import Container
from engine.database.database import Database
from engine.database.pruned_rows import PrunedRows
from engine.model.model import Model
from engine.model.prunable import Prunable
from engine.model.tables import Tables
from engine.query.queries import Queries
from engine.registry.registry import Registry

BATCH_ROWS = 500
MOST_BATCHES = 20
FREED_PAGES = 5000
BATCH_REASON = "one batch of rows a model names prunable, deleted together"


class RowPruning:
    """Deletes, for every model that is Prunable, the rows its prunable() query names, in batches of their own
    short writes, then gives the freed pages back. A parent's query leaves out rows a child still points at, so
    children go first and the parent follows on a later batch."""

    def __call__(self, container: Container) -> None:
        database, queries, tables = container.get(Database), container.get(Queries), container.get(Tables)
        rows = PrunedRows(database)
        for model in RowPruning.prunable_models(container.get(Registry)):
            for _ in range(MOST_BATCHES):
                ids = model.prunable(queries.query(model).with_removed(), tables.table(model).name).oldest().limit(BATCH_ROWS, BATCH_REASON).pluck("id", int)
                if not ids:
                    break
                with database.transaction():
                    rows.delete(tables.table(model).name, ids)
        database.release_free_pages(FREED_PAGES)

    @staticmethod
    def prunable_models(registry: Registry) -> list[type[Prunable]]:
        models = (entry.model.checked_class(Model) for entry in registry.models.values())
        return [model for model in models if issubclass(model, Prunable)]
