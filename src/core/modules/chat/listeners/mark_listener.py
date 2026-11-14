from enum import StrEnum
from dataclasses import replace
from typing import ClassVar

from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.enums.mark_outcome import MarkOutcome
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from core.modules.chat.queries.conditions.mark_round_key import MarkRoundKey
from engine.event.event_subscriber import E
from engine.listener.rows.event_rows import EventRows


class MarkListener(CommitListener[E]):
    """Shows a module's marks after commit and keeps each explicit listener key in its current round."""

    module_name: ClassVar[str]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, event_rows: EventRows) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries
        self.event_rows = event_rows

    def is_agent_command(self, logged: LoggedEvent, command: str) -> bool:
        return logged.command == command and self.queries.query(ActorRecord).find(logged.actor_id).type is ActorType.AGENT

    def show(self, logged: LoggedEvent, type: StrEnum, variant: StrEnum, text: str, agent_id: int | None = None,
             row_model: str = "", row_id: int | None = None, detail: str = "", key: str | None = None, ended: bool = True, outcome: MarkOutcome = MarkOutcome.NONE) -> None:
        if self.bus.scopes.environment_id is None:
            return
        command: ShowMark | None = ShowMark(type, variant, key if key is not None else f"{variant.value}:{logged.row_id}:{logged.id}", text,
                                          agent_id=agent_id, detail=detail, row_model=row_model, row_id=row_id, ended=ended, is_new_key=key is None, outcome=outcome)
        if key is not None:
            command = self.round_mark(logged, command)
        if command is None:
            return
        self.bus.run(command, self.actors.actor(self.module_name), cause_id=logged.id)

    def round_mark(self, logged: LoggedEvent, command: ShowMark) -> ShowMark | None:
        keys = MarkRoundKey(command.key)
        mark = self.queries.query(ChatMark).matching(keys).newest().first()
        if mark is None:
            return command
        if mark.state is ChatMarkState.ENDED and command.ended:
            return None
        return replace(command, key=keys.new_key(logged.id) if mark.state is ChatMarkState.ENDED else mark.key)
