from enum import StrEnum
from typing import ClassVar

from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.chat.mark_outcome import MarkOutcome
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.commands.show_mark.show_mark import ShowMark


class MarkListener(CommitListener):
    """What every module's mark listener shares: showing one mark, as the module that declares its type,
    for the event that caused it, keyed by the variant, the row and the event so a listener run twice for
    one event leaves one mark, unless it names the key of a process mark it keeps up and ends."""

    module_name: ClassVar[str]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def is_agent_command(self, event: LoggedEvent, command: str) -> bool:
        return event.command == command and self.queries.query(ActorRecord).find(event.actor_id).type is ActorType.AGENT

    def show(self, event: LoggedEvent, type: StrEnum, variant: StrEnum, text: str, environment_id: int | None = None, agent_id: int | None = None,
             row_model: str = "", row_id: int | None = None, detail: str = "", key: str = "", ended: bool = True, outcome: MarkOutcome = MarkOutcome.NONE) -> None:
        environment_id = environment_id or event.environment_id
        if environment_id is None:
            return
        key = key or f"{variant.value}:{event.row_id}:{event.id}"
        self.bus.run(ShowMark(environment_id, type, variant, key, text, agent_id=agent_id, detail=detail, row_model=row_model, row_id=row_id, ended=ended, outcome=outcome),
                     self.actors.actor(self.module_name), cause_id=event.id, environment_id=environment_id)
