from collections.abc import Generator, Sequence
from contextlib import contextmanager, nullcontext
from dataclasses import replace
from typing import ContextManager, TypeVar

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.change import Change
from engine.event.event_log import EventLog
from engine.event.logged_event import LoggedEvent
from engine.database.actor_table import ActorTable
from engine.database.database import Database
from engine.model.agent_scoped import AgentScoped
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.session_bound import SessionBound
from engine.model.session_private import SessionPrivate
from engine.model.table import indefinite_article
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from engine.row.row_owner import RowOwner
from engine.scope.scope import Scope
from engine.scope.scope_opening import ScopeOpening

M = TypeVar("M", bound=Model)
WholeScopes = Sequence[type[Scope]]
DisabledScopes = Sequence[type[Scope] | ScopeOpening]


class Scopes:
    """The agent and environment the work in hand is scoped on, set once where the work enters: the agent running
    a command, the environment a request names, or the agent and environment of the event a listener hears. A
    class passes a scope by naming it in disabled_scopes, and a job with no scope reads every row."""

    def __init__(self, database: Database, actors: ActorTable, log: EventLog) -> None:
        self.database, self.actors, self.log = database, actors, log
        self.actor_id: int | None = None
        self.decided = False
        self.causing_agents: dict[int, int | None] = {}

    @property
    def environment_id(self) -> int | None:
        return self.database.scope_environment_id

    def applied(self, model: M) -> M:
        model = self.with_environment(model)
        owner = self.database.row_owner
        if isinstance(model, AgentScoped) and owner is not None and not model.is_saved:
            return model.changed(agent_id=owner.stored_agent_id)
        return model if self.actor_id is None or model.is_saved else self.with_session(model, self.actor_id)

    def with_environment(self, model: M) -> M:
        if model.is_saved or not isinstance(model, EnvironmentScoped):
            return model
        if self.environment_id is not None:
            return model.changed(environment_id=self.environment_id)
        if model.environment_id:
            return model
        raise Refusal(f"{indefinite_article(model.cli_name)} {model.cli_name} needs an environment", "name it with --environment")

    def with_session(self, model: M, actor_id: int) -> M:
        if isinstance(model, SessionBound) and model.session_agent_id is None:
            return replace(model, session_agent_id=actor_id)
        if isinstance(model, SessionPrivate) and model.session_agent_id != actor_id:
            return replace(model, state=model.hidden_state)
        return model

    def check_environment(self, actor: Actor, environment_id: int | None) -> None:
        owner = self.actors.row_owner(actor.id if actor.type is ActorType.AGENT else None)
        if owner is None or environment_id is None or owner.environment_id == environment_id:
            return
        if not self.actors.is_granted_test_environment(actor.id, environment_id):
            raise Refusal(f"agent {actor.id} works only in its own environment, environment {owner.environment_id}", "leave out --environment")

    def command_scope(self, disabled: WholeScopes, actor: Actor, environment_id: int | None = None) -> ContextManager[None]:
        if self.decided and not disabled and (environment_id is None or self.environment_id is not None):
            return nullcontext()
        return self.opened(self.acting_id(actor), environment_id or self.environment_id, disabled)

    def acting_id(self, actor: Actor) -> int | None:
        if self.decided:
            return self.actor_id
        return actor.id if actor.type is ActorType.AGENT else None

    def event_scope(self, disabled: DisabledScopes, event: LoggedEvent) -> ContextManager[None]:
        return self.opened(self.causing_agent(event), event.environment_id, self.passed(disabled, event))

    def row_scope(self, row: EnvironmentScoped) -> ContextManager[None]:
        return self.opened(self.actor_id, row.environment_id)

    def change_scope(self, disabled: DisabledScopes, change: Change[Model]) -> ContextManager[None]:
        passed = self.passed(disabled, change)
        return self.opened(self.actor_id, self.environment_id, passed) if passed else nullcontext()

    @contextmanager
    def read_scope(self, disabled: WholeScopes, actor_id: int | None, environment_id: int | None = None) -> Generator[None]:
        previous = self.database.read_actor_id, self.database.row_owner
        self.database.read_actor_id = None if ActorScope in disabled else actor_id
        self.database.row_owner = self.owner(actor_id, environment_id, disabled)
        try:
            yield
        finally:
            self.database.read_actor_id, self.database.row_owner = previous

    @contextmanager
    def opened(self, actor_id: int | None, environment_id: int | None = None, disabled: WholeScopes = ()) -> Generator[None]:
        previous = self.actor_id, self.decided, self.database.row_owner
        owner = self.owner(actor_id, environment_id, disabled)
        self.actor_id, self.decided, self.database.row_owner = None if ActorScope in disabled else actor_id, True, owner
        try:
            yield
        finally:
            self.actor_id, self.decided, self.database.row_owner = previous

    def owner(self, actor_id: int | None, environment_id: int | None, disabled: WholeScopes = ()) -> RowOwner | None:
        owner = self.actors.row_owner(actor_id) or RowOwner(None, environment_id)
        agent = None if ActorScope in disabled else owner.agent
        environment = None if EnvironmentScope in disabled else self.working_environment(actor_id, owner, environment_id)
        return None if agent is None and environment is None else RowOwner(agent, environment)

    def working_environment(self, actor_id: int | None, owner: RowOwner, environment_id: int | None) -> int | None:
        if actor_id is None or environment_id is None or environment_id == owner.environment_id:
            return owner.environment_id
        return environment_id if self.actors.is_granted_test_environment(actor_id, environment_id) else owner.environment_id

    def passed(self, disabled: DisabledScopes, subject: LoggedEvent | Change[Model]) -> WholeScopes:
        return tuple(entry.scope if isinstance(entry, ScopeOpening) else entry for entry in disabled if not isinstance(entry, ScopeOpening) or entry.passes(subject))

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
