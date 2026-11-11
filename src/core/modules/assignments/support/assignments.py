from dataclasses import replace

from engine.command.context import Context
from engine.enums.actor_count import ActorCount
from engine.enums.actor_type import ActorType
from engine.model.assignable import Assignable
from engine.model.children import Children
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
from core.modules.assignments.models.enums.kept_reason import KeptReason
from core.modules.assignments.errors.parent_assignment_refusal import ParentAssignmentRefusal
from core.modules.assignments.support.assignable_rows import AssignableRows
from core.modules.assignments.support.cascade import Cascade
from core.modules.assignments.support.cascade_walk import CascadeWalk


class Assignments:
    """Gives rows of assignable models to actors and reads who holds a row. It is the one place that
    writes the assignments table. Only a person or an agent that has not ended can be given a row. A row
    of a model that one actor holds passes from its holder to the next in one change; a row of a model
    that several actors hold gains a holder. An assigned row also assigns the children its model declares:
    a child with no assignment inherits one, a child that inherited from the row's last assignment follows
    to the new one, and a child given by hand or inherited from another row is left as it is unless the
    command overrides it. Unassigning a row also removes the assignments inherited from it, each before
    the one it names, and leaves those given by hand. A row can give up a hand-given assignment and
    inherit its parent's instead. A child made or linked after its parent was assigned inherits the
    parent's assignment when it has none, and a child whose link to a parent is removed loses the
    assignment it inherited from that parent. An actor kept in a column of the row is copied as it stands,
    also an agent that has ended, while that column still exists. Every assignment is saved and deleted
    through the repository, so each is an event."""

    def __init__(self, queries: Queries, repository: Repository, rows: AssignableRows) -> None:
        self.queries, self.repository, self.rows = queries, repository, rows

    def assignments(self, row: Model) -> tuple[Assignment, ...]:
        return tuple(self.queries.query(Assignment).filter(subject_model=row.model_name, subject_id=row.id).oldest().all_rows())

    def actors(self, row: Model) -> tuple[int, ...]:
        return tuple(assignment.actor_id for assignment in self.assignments(row))

    def actor(self, row: Assignable) -> int | None:
        if row.takes_actors is not ActorCount.SINGLE:
            raise SeveralActorsError(type(row).__name__)
        return next(iter(self.actors(row)), None)

    def assign(self, row: Assignable, actor_id: int, context: Context, *, cascade: bool = True, override: bool = False) -> Cascade:
        self.require_working_actor(actor_id)
        current = self.assignments(row)
        if any(assignment.actor_id == actor_id for assignment in current):
            if row.takes_actors is ActorCount.SEVERAL:
                raise RepeatedAssignmentRefusal(row.model_name, row.id, actor_id)
            return Cascade()
        replaced = current if row.takes_actors is ActorCount.SINGLE else ()
        given = self.repository.save(Assignment(creator_id=context.actor.id, subject_model=row.model_name, subject_id=row.id, actor_id=actor_id), context)
        outcome = Cascade().with_assigned(row.model_name)
        for previous in replaced or [None]:
            outcome = self.cascaded(row, given, previous, CascadeWalk(context, override), outcome) if cascade else outcome
        for previous in replaced:
            self.release(previous, context)
        return outcome

    def cascaded(self, parent: Assignable, given: Assignment, previous: Assignment | None, walk: CascadeWalk, outcome: Cascade) -> Cascade:
        for children in parent.assigns:
            for child in self.child_rows(parent, children):
                if child.cascade_skips(given.actor_id):
                    outcome = outcome.with_kept(child.model_name, child.id, KeptReason.MODEL_RULE)
                else:
                    outcome = self.child_cascade(child, given, previous, walk, outcome)
        return outcome

    def child_cascade(self, child: Assignable, given: Assignment, previous: Assignment | None, walk: CascadeWalk, outcome: Cascade) -> Cascade:
        current = self.assignments(child)
        inherited = tuple(assignment for assignment in current if previous is not None and assignment.source_id == previous.id)
        if current and not inherited and not walk.override:
            reason = KeptReason.HAND_GIVEN if any(assignment.source_id is None for assignment in current) else KeptReason.FOREIGN_SOURCE
            return outcome.with_kept(child.model_name, child.id, reason)
        replaced = inherited or current
        kept_row = next((assignment for assignment in replaced if assignment.actor_id == given.actor_id), None)
        if kept_row is not None:
            self.repository.save(replace(kept_row, source_id=given.id), walk.context)
            return outcome
        inherited_row = self.repository.save(Assignment(creator_id=walk.context.actor.id, subject_model=child.model_name, subject_id=child.id, actor_id=given.actor_id, source_id=given.id), walk.context)
        outcome = outcome.with_assigned(child.model_name)
        deeper = walk.deeper(child.model_name)
        for former in replaced or [None]:
            outcome = self.cascaded(child, inherited_row, former, deeper, outcome)
        for former in replaced:
            self.release(former, walk.context)
        return outcome

    def child_rows(self, parent: Assignable, children: Children) -> tuple[Assignable, ...]:
        if children.link_model is None or children.link_column is None:
            return tuple(self.queries.query(children.model).filter(**{children.column: parent.id}).all_rows())
        links = self.queries.query(children.link_model).filter(**{children.column: parent.id}).all_rows()
        return tuple(self.queries.query(children.model).find_many([getattr(link, children.link_column) for link in links]))

    def release(self, assignment: Assignment, context: Context) -> None:
        for dependent in self.queries.query(Assignment).filter(source_id=assignment.id).all_rows():
            self.repository.save(replace(dependent, source_id=None), context)
        self.repository.delete_stored(assignment, context)

    def unassign(self, row: Assignable, context: Context, actor_id: int | None = None) -> tuple[Assignment, ...]:
        removed = tuple(assignment for assignment in self.assignments(row) if actor_id is None or assignment.actor_id == actor_id)
        for assignment in removed:
            self.remove(assignment, context)
        return removed

    def remove(self, assignment: Assignment, context: Context) -> None:
        for inherited in self.queries.query(Assignment).filter(source_id=assignment.id).all_rows():
            self.remove(inherited, context)
        self.repository.delete_stored(assignment, context)

    def follow_parent(self, child: Assignable, context: Context) -> None:
        parents = self.rows.parents(child)
        if not parents or self.assignments(child):
            return
        source = next((assignment for parent in parents for assignment in self.assignments(parent)), None)
        if source is not None and not child.cascade_skips(source.actor_id):
            self.child_cascade(child, source, None, CascadeWalk(context, override=False), Cascade())

    def leave_parent(self, parent: Assignable, child: Assignable, context: Context) -> None:
        source_ids = {assignment.id for assignment in self.assignments(parent)}
        for assignment in self.assignments(child):
            if assignment.source_id in source_ids:
                self.remove(assignment, context)

    def inherit(self, row: Assignable, context: Context) -> Cascade:
        source = next((assignment for parent in self.rows.parents(row) for assignment in self.assignments(parent)), None)
        if source is None:
            raise ParentAssignmentRefusal(row.model_name, row.id)
        return self.child_cascade(row, source, None, CascadeWalk(context, override=True), Cascade())

    def copy_actor(self, row: Assignable, actor_id: int | None, context: Context) -> None:
        current = self.assignments(row)
        if [assignment.actor_id for assignment in current] == [actor_id]:
            return
        for assignment in current:
            self.remove(assignment, context)
        if actor_id is not None and self.queries.query(ActorRecord).filter(id=actor_id).exists():
            self.repository.save(Assignment(creator_id=context.actor.id, subject_model=row.model_name, subject_id=row.id, actor_id=actor_id), context)

    def require_working_actor(self, actor_id: int) -> None:
        actor = self.queries.query(ActorRecord).filter(id=actor_id).first()
        if actor is None:
            raise UnknownActorRefusal(actor_id)
        if not actor.type.can_receive_work:
            raise ActorTypeRefusal(actor_id, actor.type)
        agent = self.queries.query(Agent).filter(id=actor_id).first() if actor.type is ActorType.AGENT else None
        if agent is not None and agent.ended_at is not None:
            raise EndedAgentRefusal(agent.number)
