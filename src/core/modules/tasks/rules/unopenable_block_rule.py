from dataclasses import replace

from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
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
from core.modules.tasks.support.task_nudges import BLOCK_REVIEW, BLOCK_REVIEW_REQUIRED, BLOCK_REVIEW_REMINDER, USER_BLOCK_REVIEW

SKIPPED_REVIEWS_READ = 20


class UnopenableBlockRule(DriverRule):
    """Reminds the main agent of its blocked tasks every 15 minutes or 5 closed tasks. The reminder may pass
    twice; the third time, with none of the tasks named having moved, it blocks the agent until the tasks
    are acted on or the block is skipped with a reason. A task whose review was skipped with a reason is left
    out until it moves, and the tasks a module's scope leaves out, such as those outside a focused plan, are
    never reviewed."""

    name = "tasks.unopenable-blocks"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, spans: SpanQueries, passes: ReminderPasses, scope: BlockReviewScope) -> None:
        self.queries, self.spans, self.passes, self.scope = queries, spans, passes, scope

    def answer(self, hook: AgentHook) -> RuleAnswer:
        blocked = tuple(self.queries.query(TaskBlockReview).filter(session_agent_id=hook.agent_id, state=TaskState.BLOCKED, automatic=False).all_rows())
        tasks = self.unskipped(hook.agent_id, self.scope.covered(hook.agent_id, blocked)) if blocked else ()
        if not tasks:
            return RuleAnswer.allowed()
        block = self.queries.query(AgentBlock).filter(session_agent_id=hook.agent_id, nudge_key=BLOCK_REVIEW_REQUIRED.key).matching(IsNull("closed_at")).first()
        if block is not None and TaskBlocksReviewed.stored(block.condition_text).pending(tasks):
            return RuleAnswer.allowed()
        passed = BLOCK_REVIEW_REMINDER.interval.has_passed_many(self.spans, hook.agent_id, [task.reviewed_at for task in tasks], hook.timestamp)
        due = [task for task, passed_span in zip(tasks, passed) if passed_span]
        if not due:
            return RuleAnswer.allowed()
        reminder = self.passes.round(hook.agent_id, BLOCK_REVIEW_REMINDER, [ReminderSubject(str(task.task_id), task.moved_at) for task in due])
        notices = [replace((USER_BLOCK_REVIEW if task.user_wait else BLOCK_REVIEW).nudge(task=task.task_id),
                           interval=None, record_keys=tuple([f"{BLOCK_REVIEW.key}.{task.task_id}"])) for task in due]
        answer = RuleAnswer.with_nudges(*notices).running(reminder.record)
        blocking = [task for task in due if str(task.task_id) in reminder.blocking]
        if not blocking:
            return answer
        refusal = BLOCK_REVIEW_REQUIRED.nudge(tasks=", ".join(str(task.task_id) for task in blocking), block="{block}")
        return answer.running(BlockUntil(hook.agent_id, refusal, TaskBlocksReviewed.build(blocking), is_skippable=True))

    def unskipped(self, agent_id: int, tasks: tuple[TaskBlockReview, ...]) -> tuple[TaskBlockReview, ...]:
        skipped = self.queries.query(AgentBlock).filter(session_agent_id=agent_id, nudge_key=BLOCK_REVIEW_REQUIRED.key).matching(Greater("skip_reason", "")).newest().limited(SKIPPED_REVIEWS_READ)
        skipped_at: dict[int, Timestamp] = {}
        for block in reversed(skipped):
            for task_id in TaskBlocksReviewed.stored(block.condition_text).task_ids():
                skipped_at[task_id] = block.closed_at
        return tuple(task for task in tasks if task.task_id not in skipped_at or task.moved_at > skipped_at[task.task_id])
