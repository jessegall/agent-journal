import io
import re
from typing import TypeVar

from engine.container.container import Container
from engine.database.seed_tables import ID_COLUMN
from engine.model.model import Model
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.registry.registry import Registry
from engine.database.database import Database
from engine.model.tables import Tables
from engine.subcommand.output import Output

STORY_ROWS_REASON = "the story kit lists every row of a table for an assertion"
TOUCHED_LINE = re.compile(r"^(?:created|updated): (.+)$", re.MULTILINE)

M = TypeVar("M", bound=Model)


class KitRows:
    """The rows a test reads for an assertion, through the journal's own queries: every row, the first, the
    newest, whether one exists and how many, each of a model filtered by its values, the registry, and a
    line's output with the rows it created or updated written out. A story and an integration journal read
    them alike."""

    container: Container

    def story_rows(self, model: type[M], **values: object) -> tuple[M, ...]:
        return tuple(self.container.get(Queries).query(model).filter(**values).matching(Minimum(ID_COLUMN, 1)).every_row(STORY_ROWS_REASON))

    def first_row(self, model: type[M], **values: object) -> M | None:
        return self.container.get(Queries).query(model).filter(**values).first()

    def newest_row(self, model: type[M], **values: object) -> M | None:
        return self.container.get(Queries).query(model).filter(**values).newest().first()

    def row_exists(self, model: type[M], **values: object) -> bool:
        return self.container.get(Queries).query(model).filter(**values).exists()

    def row_count(self, model: type[M], **values: object) -> int:
        return self.container.get(Queries).query(model).filter(**values).count()

    # the registry the last sync wrote: the modules' windows, marks, models and the rest
    def registry(self) -> Registry:
        return Registry.read(self.container.get(Database))

    # a line's output with every row its created and updated lines name written out, as an assertion reads its fields
    def with_touched_rows(self, output_text: str) -> str:
        loaded_classes = (entry.model.loaded() for entry in self.container.get(Registry).models.values())
        models = {model.model_name: model for model in loaded_classes if issubclass(model, Model)}
        stream = io.StringIO()
        output = Output(self.container.get(Tables), False, stream)
        for match in TOUCHED_LINE.finditer(output_text):
            for model_name, row_id in (name.split(":") for name in match[1].split(", ")):
                for row in self.container.get(Queries).query(models[model_name]).filter(id=int(row_id)).get() if model_name in models else ():
                    output.row(row)
        return output_text + stream.getvalue()
