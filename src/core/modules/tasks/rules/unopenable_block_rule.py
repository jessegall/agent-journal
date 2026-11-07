from dataclasses import replace

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.block_until import BlockUntil
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.span_queries import SpanQueries
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.support.reminder_passes import ReminderPasses, ReminderSubject
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task_block_review import TaskBlockReview
from core.modules.tasks.support.block_conditions.task_blocks_reviewed import TaskBlocksReviewed
from core.modules.tasks.support.task_nudges import BLOCK_REVIEW, BLOCK_REVIEW_REQUIRED, BLOCK_REVIEW_REMINDER, USER_BLOCK_REVIEW

class UnopenableBlockRule(DriverRule):
    """Reminds the main agent of its blocked tasks every 15 minutes or 5 closed tasks. It may let the reminder pass twice;
    the third time, with none of the tasks named having moved, it holds the agent until the tasks are acted on or the
    hold is skipped with a reason."""

    name = "tasks.unopenable-blocks"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, spans: SpanQueries, passes: ReminderPasses) -> None:
        self.queries, self.spans, self.passes = queries, spans, passes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tasks = tuple(self.queries.query(TaskBlockReview).filter(session_agent_id=hook.agent_id, state=TaskState.BLOCKED, automatic=False).all_rows())
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
        held = [task for task in due if str(task.task_id) in reminder.holding]
        if not held:
            return answer
        refusal = BLOCK_REVIEW_REQUIRED.nudge(tasks=", ".join(str(task.task_id) for task in held), block="{block}")
        return answer.running(BlockUntil(hook.agent_id, refusal, TaskBlocksReviewed.build(held), is_skippable=True))
