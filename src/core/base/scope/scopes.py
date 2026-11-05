from collections.abc import Generator, Sequence
from contextlib import contextmanager, nullcontext
from typing import ContextManager, TypeVar

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.database.actor_table import ActorTable
from core.base.database.database import Database
from core.base.model.agent_scoped import AgentScoped
from core.base.model.model import Model
from core.base.scope.actor_scope import ActorScope
from core.base.scope.row_owner import RowOwner
from core.base.scope.scope import Scope
from core.base.scope.scope_opening import ScopeOpening

M = TypeVar("M", bound=Model)
WholeScopes = Sequence[type[Scope]]
DisabledScopes = Sequence[type[Scope] | ScopeOpening]


class Scopes:
    """Which agent the work in hand is scoped on: the agent running a command, or the first agent along the
    causes of the event a listener hears. Whoever declares ActorScope in disabled_scopes runs with no scope,
    and a person's or the journal's own work has none."""

    def __init__(self, database: Database, actors: ActorTable, log: EventLog) -> None:
        self.database, self.actors, self.log = database, actors, log
        self.actor_id: int | None = None
        self.decided = False
        self.causing_agents: dict[int, int | None] = {}

    def applied(self, model: M) -> M:
        owner = self.database.row_owner
        if isinstance(model, AgentScoped) and owner is not None and not model.is_saved:
            return model.changed(agent_id=owner.stored_agent_id)
        return model if self.actor_id is None else model.scoped(self.actor_id)

    def command_scope(self, disabled: WholeScopes, actor: Actor, environment_id: int | None = None) -> ContextManager[None]:
        if ActorScope in disabled:
            return self.opened(None)
        if self.decided:
            return nullcontext()
        if actor.type is ActorType.USER:
            return self.opened(None, environment_id)
        return self.opened(actor.id if actor.type is ActorType.AGENT else None)

    def event_scope(self, disabled: DisabledScopes, event: LoggedEvent) -> ContextManager[None]:
        return self.opened(None if self.passes(disabled, event) else self.causing_agent(event))

    def change_scope(self, disabled: DisabledScopes, change: Change[Model]) -> ContextManager[None]:
        return self.opened(None) if self.passes(disabled, change) else nullcontext()

    @contextmanager
    def read_scope(self, disabled: WholeScopes, actor_id: int | None, environment_id: int | None = None) -> Generator[None]:
        previous = self.database.read_actor_id, self.database.row_owner
        self.database.read_actor_id = None if ActorScope in disabled else actor_id
        self.database.row_owner = self.owner(self.database.read_actor_id, environment_id)
        try:
            yield
        finally:
            self.database.read_actor_id, self.database.row_owner = previous

    @contextmanager
    def opened(self, actor_id: int | None, environment_id: int | None = None) -> Generator[None]:
        previous = self.actor_id, self.decided, self.database.row_owner
        self.actor_id, self.decided, self.database.row_owner = actor_id, True, self.owner(actor_id, environment_id)
        try:
            yield
        finally:
            self.actor_id, self.decided, self.database.row_owner = previous

    def owner(self, actor_id: int | None, environment_id: int | None) -> RowOwner | None:
        agent = self.actors.row_owner(actor_id)
        if agent is not None or environment_id is None:
            return agent
        return RowOwner(None, environment_id)

    def passes(self, disabled: DisabledScopes, subject: LoggedEvent | Change[Model]) -> bool:
        return any(entry is ActorScope or (isinstance(entry, ScopeOpening) and entry.scope is ActorScope and entry.passes(subject)) for entry in disabled)

    def causing_agent(self, event: LoggedEvent) -> int | None:
        if event.id not in self.causing_agents:
            self.causing_agents[event.id] = self.found_agent(event)
        return self.causing_agents[event.id]

    def found_agent(self, event: LoggedEvent) -> int | None:
        if self.actors.is_agent(event.actor_id):
            return event.actor_id
        if event.cause_id is None:
            return None
        if event.cause_id in self.causing_agents:
            return self.causing_agents[event.cause_id]
        return self.causing_agent(self.log.event(event.cause_id))
