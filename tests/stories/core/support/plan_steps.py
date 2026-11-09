from core.base.actor import Actor
from core.base.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.testing.story import Story
from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip


def state_tasks_wait_on_nothing(story: Story, actor: Actor | None, plan_id: int = 1) -> None:
    for task in story.container.get(Queries).query(PlanTask).filter(plan_id=plan_id).all_rows():
        story.expect_success(f'task waits-on-nothing {task.task_id} --why "the order does not matter in this story"', actor=actor)


def ready_plan(story: Story, plan_id: int = 1, actor: Actor | None = None) -> None:
    state_tasks_wait_on_nothing(story, actor, plan_id)
    story.run(f"plan ready {plan_id} --environment main", actor)
    if actor is not None and actor.is_agent():
        confirmed_skip(story, "plans.one-task-phase", actor, "one task is enough in this story")
    story.run(f'plan ready {plan_id} --environment main --skip-guard plans.one-task-phase --skip-reason "one task is enough in this story"', actor)
