from engine.query.conditions.condition import Condition
from engine.query.condition_join import ConditionJoin
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.among import Among
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.case_when import CaseWhen
from engine.query.expressions.column import Column
from engine.query.expressions.comparison import Comparison
from engine.query.expressions.function_call import FunctionCall
from engine.query.expressions.json_object import JsonObject
from engine.query.expressions.literal import Literal
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select
from core.modules.assignments.models.support.views import assigned_row_ids
from core.modules.tasks.models.support.views import TASK_ACTOR
from core.modules.processes.models.support.views import RUNNING_STATES

WAITING_PROOF_STATES = ("queued", "running")
UNFINISHED_STATES = ("open", "started", "testing", "blocked")
WORKER = "worktree.session_agent_id"
WORKER_AGENT = ConditionJoin("agents", condition=ColumnCompare("agents.id", "=", WORKER))
STARTED_AT = FunctionCall(SqlFunction.COALESCE, [Column("worktree.cut_at"), Column("worktree.created_at")])
LATEST_WORKTREE = Comparison(Column("worktree.id"), ComparisonOperator.EQUAL, ScalarSubselect(
    Select("worker_worktrees").named_as("latest").selecting(FunctionCall(SqlFunction.MAX, [Column("latest.id")]))
    .matching(ColumnCompare("latest.session_agent_id", "=", WORKER))))


def worktrees() -> Select:
    return Select("worker_worktrees").named_as("worktree")


def worktree_proofs(condition: Condition) -> Exists:
    return Exists(Select("proofs").matching(ColumnCompare("proofs.worktree_id", "=", "worktree.id")).matching(condition))


# The rows of a table that belong to the worker of the outer worktree by the given column.
def worker_rows(table: str, column: str) -> Select:
    return Select(table).matching(ColumnCompare(f"{table}.{column}", "=", WORKER))


def worktree_state(state: str) -> Equal:
    return Equal("worktree.state", state)


RUNNING_PROOF = Exists(Select("proofs").joined(ConditionJoin("processes", condition=ColumnCompare("processes.id", "=", "proofs.process_id")))
                       .matching(ColumnCompare("proofs.worktree_id", "=", "worktree.id")).matching(Equal("proofs.state", "running"))
                       .matching(IsNull("processes.queued_at")))

WORKER_WORK_REVIEW_SELECT = worktrees().selecting(
    Aliased(Column(WORKER), "agent_id"), Column("worktree.environment_id"),
    Aliased(CaseWhen([
        (worktree_state("cut"), Literal("changes requested")),
        (HasValue("worktree.returned_at"), Literal("with the main agent")),
        (RUNNING_PROOF, Literal("tests running")),
        (worktree_proofs(Among("proofs.state", WAITING_PROOF_STATES)), Literal("tests queued")),
        (IsNull("worktree.merge_ready_at"), Literal("judging")),
    ], Literal("waiting for the merge")), "status"),
).joined(WORKER_AGENT).matching(HasValue("worktree.delivered_at")).matching(Among("worktree.state", ("cut", "delivered"))).matching(
    IsNull("worktree.removed_at")).matching(IsNull("agents.retired_at")).view_sql()

WORKER_POINTS_SELECT = Select("worker_worktrees").selecting(
    Aliased(Column("worker_worktrees.id"), "worktree_id"), Column("worker_worktrees.session_agent_id"),
    Aliased(Column("tasks.title"), "task_title"), Aliased(Column("tasks.brief"), "task_brief"),
    Aliased(ScalarSubselect(Select("proofs").selecting(FunctionCall(SqlFunction.JSON_GROUP_ARRAY, [JsonObject({
        "point": Column("proofs.point"), "state": Column("proofs.state"), "text": Column("proofs.text"), "shortfall": Column("proofs.shortfall")})]))
        .matching(ColumnCompare("proofs.worktree_id", "=", "worker_worktrees.id")).matching(ColumnCompare("proofs.task_id", "=", "worker_worktrees.task_id"))),
        "proofs"),
).joined(ConditionJoin("tasks", condition=ColumnCompare("tasks.id", "=", "worker_worktrees.task_id"))).view_sql()

RUNNING_PROCESSES = worker_rows("processes", "session_agent_id").matching(Among("processes.state", RUNNING_STATES))
STARTED_WAIT = CaseWhen([
    (IsNull("agents.ended_at"), Literal("")),
    (Exists(worker_rows("reader_requests", "creator_id").matching(IsNull("reader_requests.completed_at"))), Literal("reader")),
    (Exists(RUNNING_PROCESSES.matching(HasValue("processes.queued_at"))), Literal("place in the queue")),
    (Exists(RUNNING_PROCESSES), Literal("command to finish")),
], Literal("next start"))
UNFINISHED_ASSIGNED = Exists(Select("tasks").matching(Comparison(TASK_ACTOR, ComparisonOperator.EQUAL, Column(WORKER)))
                             .matching(Among("tasks.state", UNFINISHED_STATES)), negated=True)

WORKER_WAITS_SELECT = worktrees().selecting(
    Aliased(Column(WORKER), "agent_id"), Column("worktree.environment_id"),
    Aliased(CaseWhen([
        (Exists(worker_rows("tasks", "holder_id").matching(Equal("tasks.state", "started"))), STARTED_WAIT),
        (worktree_proofs(Among("proofs.state", WAITING_PROOF_STATES)), Literal("tests")),
        (AllOf([worktree_state("delivered"), worktree_proofs(Equal("proofs.state", "shown"))]), Literal("proof check")),
        (worktree_state("delivered"), Literal("merge")),
        (AllOf([worktree_state("cut"), UNFINISHED_ASSIGNED]), Literal("a job")),
        (HasValue("agents.ended_at"), Literal("a job")),
    ], Literal("")), "reason"),
).joined(WORKER_AGENT).matching(IsNull("worktree.removed_at")).matching(LATEST_WORKTREE).view_sql()

WORKER_TASK_IDS = assigned_row_ids("task", WORKER).union(Select("tasks").named_as("held").selecting(Column("held.id"))
                                                         .matching(ColumnCompare("held.holder_id", "=", WORKER)), every=False)
WORKER_PROGRESS_SELECT = worktrees().selecting(
    Aliased(Column(WORKER), "agent_id"), Column("worktree.environment_id"), Column("worktree.branch"), Column("worktree.task_id"),
    Aliased(STARTED_AT, "started_at"), Aliased(Column("worktree.removed_at"), "finished_at"),
    Aliased(FunctionCall(SqlFunction.COUNT, [Column("tasks.id")]), "task_count"),
    Aliased(FunctionCall(SqlFunction.COUNT, [CaseWhen([(Among("tasks.state", ("completed", "testing")), Literal(1))])]), "completed_count"),
).joined(ConditionJoin("tasks", left=True, condition=AllOf([
    SubqueryMatch("tasks.id", WORKER_TASK_IDS),
    AnyOf([IsNull("tasks.closed_at"), Comparison(Column("tasks.closed_at"), ComparisonOperator.AT_LEAST, STARTED_AT)])]))).matching(
    LATEST_WORKTREE).grouped("worktree.environment_id", "worktree.id").view_sql()
