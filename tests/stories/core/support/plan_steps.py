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


def started_plan(story: Story, plan_id: int, title: str) -> int:
    """Makes plan plan_id, with one phase and two tasks, and starts it as the person; returns its first task."""
    story.run(f'plan make "{title}" --environment main', actor=story.user)
    story.expect_success(f'phase make --plan {plan_id} "Build"', actor=story.user)
    task_ids = [story.new_row_id(f'task make "{title} task {number}" --environment main', actor=story.user) for number in (1, 2)]
    for task_id in task_ids:
        story.run(f"phase place {task_id} --phase {plan_id}", actor=story.user)
    ready_plan(story, plan_id, actor=story.user)
    story.run(f"plan approve {plan_id} --environment main", actor=story.user)
    story.expect_success(f"plan start {plan_id} --environment main", actor=story.user)
    return task_ids[0]
