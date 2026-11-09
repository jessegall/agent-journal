from core.base.actor import Actor
from core.testing.story import Story
from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip


def ready_plan(story: Story, plan_id: int = 1, actor: Actor | None = None) -> None:
    story.run(f"plan ready {plan_id} --environment main", actor)
    if actor is not None and actor.is_agent():
        confirmed_skip(story, "plans.one-task-phase", actor, "one task is enough in this story")
    story.run(f'plan ready {plan_id} --environment main --skip-guard plans.one-task-phase --skip-reason "one task is enough in this story"', actor)
