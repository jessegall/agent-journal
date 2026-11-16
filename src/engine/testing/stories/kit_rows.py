import io
import json
import re
from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from engine.actor.actor import Actor
from engine.database.actor_table import ActorTable
from engine.command.bus import Bus
from engine.command.command import Command
from engine.container.container import Container
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.database.seed_tables import ID_COLUMN
from engine.model.model import Model
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.registry.registry import Registry
from engine.database.database import Database
from engine.model.tables import Tables
from engine.subcommand.output import Output
from core.modules import DEFAULT_MODULES

STORY_READ_REASON = "a story reads the rows of its own journal, whichever environment they are in"
STORY_ROWS_REASON = "the story kit lists every row of a table for an assertion"
TOUCHED_LINE = re.compile(r"^(?:created|updated): (.+)$", re.MULTILINE)

M = TypeVar("M", bound=Model)
R = TypeVar("R")
SyncAnswer = TypeVar("SyncAnswer")


class KitRows(ABC, Generic[SyncAnswer]):
    """The rows a test reads for an assertion, through the journal's own queries: every row, the first, the
    newest, whether one exists and how many, each of a model filtered by its values, the registry, and a
    line's output with the rows it created or updated written out. A story and an integration journal read
    them alike: the commands, rows, timed handlers, system log and syncs of the journal a test drives."""

    def agent_actor(self, agent_id: int) -> Actor:
        return Actor.agent(self.container.get(ActorTable).actor_id(agent_id), agent_id)

    container: Container
    home: JournalHome

    def run_command(self, command: Command[R], actor: Actor, environment_id: int | None = None) -> R:
        return self.container.get(Bus).run(command, actor, environment_id=environment_id)

    def row(self, model: type[M], row_id: int) -> M:
        return self.container.get(Queries).query(model).all_environments(STORY_READ_REASON).find(row_id)

    # runs a module's tick handler by its name, as the server's ticker would
    def run_tick(self, name: str) -> None:
        handler = next(handler for module in DEFAULT_MODULES for handler in module.tick_handler_declarations() if handler.label == name)
        handler.handler(self.container)

    def system_log_text(self) -> str:
        return FileAccess.read(self.home.system_log) if FileAccess.exists(self.home.system_log) else ""

    # the module list gains the module and the journal syncs, as an install does
    def synced_with(self, module: str) -> SyncAnswer:
        modules = json.loads(FileAccess.read(self.home.module_list))
        FileAccess.write(self.home.module_list, json.dumps([*modules, module]))
        return self.synced()

    @abstractmethod
    def synced(self) -> SyncAnswer: ...

    def story_rows(self, model: type[M], **values: object) -> tuple[M, ...]:
        return tuple(self.container.get(Queries).query(model).all_environments(STORY_READ_REASON).filter(**values).matching(Minimum(ID_COLUMN, 1)).every_row(STORY_ROWS_REASON))

    def first_row(self, model: type[M], **values: object) -> M | None:
        return self.container.get(Queries).query(model).all_environments(STORY_READ_REASON).filter(**values).first()

    def newest_row(self, model: type[M], **values: object) -> M | None:
        return self.container.get(Queries).query(model).all_environments(STORY_READ_REASON).filter(**values).newest().first()

    def row_exists(self, model: type[M], **values: object) -> bool:
        return self.container.get(Queries).query(model).all_environments(STORY_READ_REASON).filter(**values).exists()

    def row_count(self, model: type[M], **values: object) -> int:
        return self.container.get(Queries).query(model).all_environments(STORY_READ_REASON).filter(**values).count()

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
                for row in self.container.get(Queries).query(models[model_name]).all_environments(STORY_READ_REASON).filter(id=int(row_id)).get() if model_name in models else ():
                    output.row(row)
        return output_text + stream.getvalue()
