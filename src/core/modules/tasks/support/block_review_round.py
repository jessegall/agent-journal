from dataclasses import dataclass, replace

from engine.driver.span_queries import SpanQueries
from engine.query.conditions.greater import Greater
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.support.reminder_passes import ReminderPasses
from core.modules.drivers.support.reminder_subject import ReminderSubject
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task_block_review import TaskBlockReview
from core.modules.tasks.support.block_conditions.task_blocks_reviewed import TaskBlocksReviewed
from core.modules.tasks.support.block_review_scope import BlockReviewScope
from core.modules.tasks.nudges.block_review_nudge import BLOCK_REVIEW_REMINDER
from core.modules.tasks.nudges.block_review_nudge import BlockReviewNudge
from core.modules.tasks.nudges.block_review_required_nudge import BlockReviewRequiredNudge
from core.modules.tasks.nudges.user_block_review_nudge import UserBlockReviewNudge

from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.request.request_values import RequestValues

BLOCKED_TASKS_REASON = "every task the agent blocked by hand is checked for a review of its block"

SKIPPED_REVIEWS_READ = 20
from engine.time.clock import Clock

BLOCK_REVIEW_KEY = "tasks.unopenable-blocks"


@dataclass(frozen=True)
class BlockReviewAnswer:
    """One round of the blocked tasks' reminder: a line for each task due, the command that records the round, and
    the line and condition of the hold its third pass opens."""

    notices: tuple[Nudge, ...]
    record: Command[object] | None
    hold: tuple[Nudge, TaskBlocksReviewed] | None


class BlockReviewRound:
    """Reminds the main agent of its blocked tasks every 15 minutes or 5 closed tasks. The reminder may pass twice;
    the third time, with none of the tasks named having moved, it blocks the agent until the tasks are acted on or
    the block is skipped with a reason. A task whose review was skipped with a reason is left out until it moves,
    and the tasks a module's scope leaves out, such as those outside a focused plan, are never reviewed. Read once
    a hook, so the lines, the record and the hold agree."""

    def __init__(self, queries: Queries, spans: SpanQueries, passes: ReminderPasses, scope: BlockReviewScope, clock: Clock, request_values: RequestValues) -> None:
        self.queries, self.spans, self.passes, self.scope, self.clock, self.request_values = queries, spans, passes, scope, clock, request_values

    def answer(self, event: HookEvent, agent_id: int) -> BlockReviewAnswer:
        # read once a hook whatever changes meanwhile: the round it records changes what the next read finds
        return self.request_values.read(f"tasks.block-review:{agent_id}:{event.firing}", lambda: event.firing, lambda: self.round(agent_id))

    def round(self, agent_id: int) -> BlockReviewAnswer:
        nothing = BlockReviewAnswer((), None, None)
        blocked = tuple(self.queries.query(TaskBlockReview).filter(session_agent_id=agent_id, state=TaskState.BLOCKED, automatic=False).every_row(BLOCKED_TASKS_REASON))
        tasks = self.unskipped(agent_id, self.scope.covered(agent_id, blocked)) if blocked else ()
        if not tasks:
            return nothing
        block = self.queries.query(AgentBlock).filter(session_agent_id=agent_id, nudge_key=BlockReviewRequiredNudge.declared().key).matching(IsNull("closed_at")).first()
        if block is not None and TaskBlocksReviewed.stored(block.condition_text).pending(tasks):
            return nothing
        passed = BLOCK_REVIEW_REMINDER.interval.has_passed_many(self.spans, agent_id, [task.reviewed_at for task in tasks], self.clock.timestamp())
        due = [task for task, passed_span in zip(tasks, passed) if passed_span]
        if not due:
            return nothing
        reminder = self.passes.round(agent_id, BLOCK_REVIEW_REMINDER, [ReminderSubject(str(task.task_id), task.moved_at) for task in due])
        notices = tuple(replace((UserBlockReviewNudge.declared() if task.user_wait else BlockReviewNudge.declared()).nudge(task=task.task_id),
                                interval=None, record_keys=tuple([f"{BlockReviewNudge.declared().key}.{task.task_id}"])) for task in due)
        blocking = [task for task in due if str(task.task_id) in reminder.blocking]
        if not blocking:
            return BlockReviewAnswer(notices, reminder.record, None)
        refusal = BlockReviewRequiredNudge.declared().nudge(tasks=", ".join(str(task.task_id) for task in blocking), block="{block}")
        return BlockReviewAnswer(notices, reminder.record, (refusal, TaskBlocksReviewed.build(blocking)))

    def unskipped(self, agent_id: int, tasks: tuple[TaskBlockReview, ...]) -> tuple[TaskBlockReview, ...]:
        skipped = self.queries.query(AgentBlock).filter(session_agent_id=agent_id, nudge_key=BlockReviewRequiredNudge.declared().key).matching(Greater("skip_reason", "")).newest().take(SKIPPED_REVIEWS_READ)
        skipped_at: dict[int, Timestamp] = {}
        for block in reversed(skipped):
            for task_id in TaskBlocksReviewed.stored(block.condition_text).task_ids():
                skipped_at[task_id] = block.closed_at
        return tuple(task for task in tasks if task.task_id not in skipped_at or task.moved_at > skipped_at[task.task_id])
