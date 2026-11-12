from engine.database.kept_rows import KeptRows
from collections.abc import Callable, Sequence
from dataclasses import replace

from engine.command.context import Context
from engine.enums.actor_count import ActorCount
from engine.enums.actor_type import ActorType
from engine.model.assignable import Assignable
from engine.model.children import Children
from engine.model.model import Model
from engine.query.conditions.among import Among
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

ASSIGNMENT_PAGE_ROWS = 50


class Assignments:
    """Gives rows of assignable models to actors and reads who holds a row, and which agent when the holder is
    an agent. It is the one place that writes the assignments table. Only a person or an agent that has not
    ended can be given a row. A row of a model that one actor holds is taken from its holder and then given
    to the next, in one change; a row of a model that several actors hold gains a holder. An assigned row
    also assigns the children its model declares: a child with no assignment inherits one, a child that
    inherited from the row's last assignment follows to the new one, and a child given by hand or inherited
    from another row is left as it is unless the command overrides it. Unassigning a row also removes the
    assignments inherited from it, each before the one it names, and leaves those given by hand. A row can
    give up a hand-given assignment and inherit its parent's instead. A child made or linked after its
    parent was assigned inherits the parent's assignment when it has none, and a child whose link to a
    parent is removed loses the assignment it inherited from that parent. An actor kept in a column of the
    row is copied as it stands, also an agent that has ended, while that column still exists. Every
    assignment is saved and deleted through the repository, so each is an event."""

    def __init__(self, queries: Queries, repository: Repository, rows: AssignableRows, kept: KeptRows) -> None:
        self.queries, self.repository, self.rows, self.kept = queries, repository, rows, kept

    def assignments(self, row: Model) -> tuple[Assignment, ...]:
        return self.kept_assignments(row.model_name, row.id, lambda: tuple(self.queries.query(Assignment).filter(subject_model=row.model_name, subject_id=row.id).oldest().all_rows()))

    def keep_rows(self, model: type[Model], row_ids: Sequence[int]) -> None:
        loaded = tuple(self.queries.query(Assignment).filter(subject_model=model.model_name).matching(Among("subject_id", list(row_ids))).oldest().all_rows(ASSIGNMENT_PAGE_ROWS))
        for row_id in row_ids:
            self.kept_assignments(model.model_name, row_id, lambda row_id=row_id: tuple(assignment for assignment in loaded if assignment.subject_id == row_id))

    def kept_assignments(self, model_name: str, row_id: int, loader: Callable[[], tuple[Assignment, ...]]) -> tuple[Assignment, ...]:
        return self.kept.read("assignments", loader, "subject_model = ? AND subject_id = ?", [model_name, row_id], name="assignments.row_assignments")

    def actors(self, row: Model) -> tuple[int, ...]:
        return tuple(assignment.actor_id for assignment in self.assignments(row))

    def row_actor_ids(self, model: type[Model], row_ids: Sequence[int]) -> dict[int, tuple[int, ...]]:
        if not row_ids:
            return {}
        marks = ", ".join("?" for _ in row_ids)
        return self.kept.read("assignments", lambda: self.loaded_actor_ids(model, tuple(row_ids)), f"subject_model = ? AND subject_id IN ({marks})",
                              [model.model_name, *row_ids], name="assignments.row_actor_ids")

    def loaded_actor_ids(self, model: type[Model], row_ids: tuple[int, ...]) -> dict[int, tuple[int, ...]]:
        actor_ids: dict[int, tuple[int, ...]] = {row_id: () for row_id in row_ids}
        assigned = self.queries.query(Assignment).filter(subject_model=model.model_name).matching(Among("subject_id", list(row_ids)))
        for assignment in assigned.oldest().all_rows(ASSIGNMENT_PAGE_ROWS):
            actor_ids[assignment.subject_id] = (*actor_ids[assignment.subject_id], assignment.actor_id)
        return actor_ids

    def actor(self, row: Assignable) -> int | None:
        if row.takes_actors is not ActorCount.SINGLE:
            raise SeveralActorsError(type(row).__name__)
        return next(iter(self.actors(row)), None)

    def agent(self, row: Assignable) -> Agent | None:
        actor_id = self.actor(row)
        if actor_id is None:
            return None
        return self.agent_row(actor_id)

    def agent_row(self, actor_id: int) -> Agent | None:
        return self.kept.read("agents", lambda: self.queries.query(Agent).filter(id=actor_id).first(), "id = ?", [actor_id], name="assignments.assigned_agent")

    def actor_record(self, actor_id: int) -> ActorRecord | None:
        return self.kept.read("actors", lambda: self.queries.query(ActorRecord).filter(id=actor_id).first(), "id = ?", [actor_id], name="assignments.actor_record")

    def assign(self, row: Assignable, actor_id: int, context: Context, *, cascade: bool = True, override: bool = False) -> Cascade:
        self.require_working_actor(actor_id)
        current = self.assignments(row)
        if any(assignment.actor_id == actor_id for assignment in current):
            if row.takes_actors is ActorCount.SEVERAL:
                raise RepeatedAssignmentRefusal(row.model_name, row.id, actor_id)
            return Cascade()
        replaced = current if row.takes_actors is ActorCount.SINGLE else ()
        inherited_ids = self.dependent_ids(replaced)
        for previous in replaced:
            self.release(previous, context)
        given = self.repository.save(Assignment(creator_id=context.actor.id, subject_model=row.model_name, subject_id=row.id, actor_id=actor_id), context)
        outcome = Cascade().with_assigned(row.model_name)
        return self.cascaded(row, given, inherited_ids, CascadeWalk(context, override), outcome) if cascade else outcome

    def cascaded(self, parent: Assignable, given: Assignment, inherited_ids: frozenset[int], walk: CascadeWalk, outcome: Cascade) -> Cascade:
        for children in parent.assigns:
            for child in self.child_rows(parent, children):
                if child.cascade_skips(given.actor_id):
                    outcome = outcome.with_kept(child.model_name, child.id, KeptReason.MODEL_RULE)
                else:
                    outcome = self.child_cascade(child, given, inherited_ids, walk, outcome)
        return outcome

    def child_cascade(self, child: Assignable, given: Assignment, inherited_ids: frozenset[int], walk: CascadeWalk, outcome: Cascade) -> Cascade:
        current = self.assignments(child)
        inherited = tuple(assignment for assignment in current if assignment.id in inherited_ids)
        if current and not inherited and not walk.override:
            reason = KeptReason.HAND_GIVEN if any(assignment.source_id is None for assignment in current) else KeptReason.FOREIGN_SOURCE
            return outcome.with_kept(child.model_name, child.id, reason)
        replaced = inherited or current
        kept_row = next((assignment for assignment in replaced if assignment.actor_id == given.actor_id), None)
        if kept_row is not None:
            self.repository.save(replace(kept_row, source_id=given.id), walk.context)
            return outcome
        dependent_ids = self.dependent_ids(replaced)
        for former in replaced:
            self.release(former, walk.context)
        inherited_row = self.repository.save(Assignment(creator_id=walk.context.actor.id, subject_model=child.model_name, subject_id=child.id, actor_id=given.actor_id, source_id=given.id), walk.context)
        return self.cascaded(child, inherited_row, dependent_ids, walk.deeper(child.model_name), outcome.with_assigned(child.model_name))

    def child_rows(self, parent: Assignable, children: Children) -> tuple[Assignable, ...]:
        if children.link_model is None or children.link_column is None:
            return tuple(self.queries.query(children.model).filter(**{children.column: parent.id}).all_rows())
        links = self.queries.query(children.link_model).filter(**{children.column: parent.id}).all_rows()
        return tuple(self.queries.query(children.model).find_many([getattr(link, children.link_column) for link in links]))

    def dependent_ids(self, assignments: Sequence[Assignment]) -> frozenset[int]:
        if not assignments:
            return frozenset()
        dependents = self.queries.query(Assignment).matching(Among("source_id", [assignment.id for assignment in assignments])).oldest().all_rows(ASSIGNMENT_PAGE_ROWS)
        return frozenset(dependent.id for dependent in dependents)

    def release(self, assignment: Assignment, context: Context) -> None:
        for dependent in self.queries.query(Assignment).filter(source_id=assignment.id).all_rows():
            self.repository.save(replace(dependent, source_id=None), context)
        self.repository.delete_stored(assignment, context)

    def unassign(self, row: Assignable, context: Context, actor_id: int | None = None) -> tuple[Assignment, ...]:
        removed = tuple(assignment for assignment in self.assignments(row) if actor_id is None or assignment.actor_id == actor_id)
        for assignment in removed:
            self.remove_of(row, assignment, context)
        return removed

    def unassign_rows(self, rows: Sequence[Assignable], context: Context) -> None:
        if not rows or rows[0].assigns:
            for row in rows:
                self.unassign(row, context)
            return
        model, row_ids = type(rows[0]), [row.id for row in rows]
        assigned = self.queries.query(Assignment).filter(subject_model=model.model_name).matching(Among("subject_id", row_ids)).all_rows(ASSIGNMENT_PAGE_ROWS)
        self.repository.delete_many_stored(list(assigned), context)
        self.keep_rows(model, row_ids)

    def remove_of(self, row: Assignable, assignment: Assignment, context: Context) -> None:
        if not row.assigns:
            self.repository.delete_stored(assignment, context)
            return
        self.remove(assignment, context)

    def remove(self, assignment: Assignment, context: Context) -> None:
        for inherited in self.queries.query(Assignment).filter(source_id=assignment.id).all_rows():
            self.remove(inherited, context)
        self.repository.delete_stored(assignment, context)

    def follow_parent(self, child: Assignable, context: Context) -> None:
        self.follow_parents(child, self.rows.parents(child), context)

    def follow_parents(self, child: Assignable, parents: Sequence[Assignable], context: Context) -> None:
        if not parents or self.assignments(child):
            return
        source = next((assignment for parent in parents for assignment in self.assignments(parent)), None)
        if source is not None and not child.cascade_skips(source.actor_id):
            self.child_cascade(child, source, frozenset(), CascadeWalk(context, override=False), Cascade())

    def leave_parent(self, parent: Assignable, child: Assignable, context: Context) -> None:
        source_ids = {assignment.id for assignment in self.assignments(parent)}
        for assignment in self.assignments(child):
            if assignment.source_id in source_ids:
                self.remove(assignment, context)

    def inherit(self, row: Assignable, context: Context) -> Cascade:
        source = next((assignment for parent in self.rows.parents(row) for assignment in self.assignments(parent)), None)
        if source is None:
            raise ParentAssignmentRefusal(row.model_name, row.id)
        return self.child_cascade(row, source, frozenset(), CascadeWalk(context, override=True), Cascade())

    def copy_actor(self, row: Assignable, actor_id: int | None, context: Context) -> None:
        current = self.assignments(row)
        if [assignment.actor_id for assignment in current] == [actor_id]:
            return
        for assignment in current:
            self.remove_of(row, assignment, context)
        if actor_id is not None and self.actor_exists(actor_id):
            self.repository.save(Assignment(creator_id=context.actor.id, subject_model=row.model_name, subject_id=row.id, actor_id=actor_id), context)

    def actor_exists(self, actor_id: int) -> bool:
        return self.kept.read("actors", self.queries.query(ActorRecord).filter(id=actor_id).exists, "id = ?", [actor_id], name="assignments.actor_exists")

    def require_working_actor(self, actor_id: int) -> None:
        actor = self.actor_record(actor_id)
        if actor is None:
            raise UnknownActorRefusal(actor_id)
        if not actor.type.can_receive_work:
            raise ActorTypeRefusal(actor_id, actor.type)
        agent = self.agent_row(actor_id) if actor.type is ActorType.AGENT else None
        if agent is not None and agent.ended_at is not None:
            raise EndedAgentRefusal(agent.number)
