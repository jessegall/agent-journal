from engine.command.context import Context
from engine.enums.actor_count import ActorCount
from engine.enums.actor_type import ActorType
from engine.model.assignable import Assignable
from engine.model.model import Model
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.assignments.errors.ended_agent_refusal import EndedAgentRefusal
from core.modules.assignments.errors.actor_type_refusal import ActorTypeRefusal
from core.modules.assignments.errors.repeated_assignment_refusal import RepeatedAssignmentRefusal
from core.modules.assignments.errors.several_actors_error import SeveralActorsError
from core.modules.assignments.errors.unknown_actor_refusal import UnknownActorRefusal
from core.modules.assignments.models.assignment import Assignment


class Assignments:
    """Gives rows of assignable models to actors and reads who holds a row. It is the one place that writes the
    assignments table. Only a person or an agent that has not ended can be given a row. A row of a model that one actor holds
    passes from its holder to the next in one change; a row of a model that several actors hold gains a
    holder. Every assignment is saved and deleted through the repository, so each is an event."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def assignments(self, row: Model) -> tuple[Assignment, ...]:
        return tuple(self.queries.query(Assignment).filter(subject_model=row.model_name, subject_id=row.id).oldest().all_rows())

    def actors(self, row: Model) -> tuple[int, ...]:
        return tuple(assignment.actor_id for assignment in self.assignments(row))

    def actor(self, row: Assignable) -> int | None:
        if row.takes_actors is not ActorCount.SINGLE:
            raise SeveralActorsError(type(row).__name__)
        return next(iter(self.actors(row)), None)

    def assign(self, row: Assignable, actor_id: int, context: Context, *, cascade: bool = True, override: bool = False) -> None:
        self.require_working_actor(actor_id)
        current = self.assignments(row)
        if any(assignment.actor_id == actor_id for assignment in current):
            if row.takes_actors is ActorCount.SEVERAL:
                raise RepeatedAssignmentRefusal(row.model_name, row.id, actor_id)
            return
        if row.takes_actors is ActorCount.SINGLE:
            self.repository.delete_many_stored(current, context)
        self.repository.save(Assignment(creator_id=context.actor.id, subject_model=row.model_name, subject_id=row.id, actor_id=actor_id), context)

    def unassign(self, row: Assignable, context: Context, actor_id: int | None = None) -> tuple[Assignment, ...]:
        removed = tuple(assignment for assignment in self.assignments(row) if actor_id is None or assignment.actor_id == actor_id)
        self.repository.delete_many_stored(removed, context)
        return removed

    def require_working_actor(self, actor_id: int) -> None:
        actor = self.queries.query(ActorRecord).filter(id=actor_id).first()
        if actor is None:
            raise UnknownActorRefusal(actor_id)
        if not actor.type.can_receive_work:
            raise ActorTypeRefusal(actor_id, actor.type)
        agent = self.queries.query(Agent).filter(id=actor_id).first() if actor.type is ActorType.AGENT else None
        if agent is not None and agent.ended_at is not None:
            raise EndedAgentRefusal(agent.number)
