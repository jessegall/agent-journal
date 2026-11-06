from core.base.actor import Actor
from core.testing.story import Story


def ready_plan(story: Story, plan_id: int = 1, actor: Actor | None = None) -> None:
    story.run(f"plan ready {plan_id} --environment main", actor)
    story.run(f'plan ready {plan_id} --environment main --skip-guard plans.one-task-phase --skip-reason "one task is enough in this story"', actor)
