from engine.actor.actor import Actor
from engine.testing.stories.story import Story
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from suites.coding.support.next_task import NextTask


def next_task_id(story: Story, excluded_id: int | None = None) -> int | None:
    """The task the coding suite hands the main agent next, read from its task assigner."""
    following = story.container.get(NextTask).following(story.agent.id, excluded_id)
    return None if following is None else following.id


def worker_next_task_id(story: Story, worker: Actor) -> int | None:
    following = story.container.get(WorkerNextTask).following(worker.id)
    return None if following is None else following.id


def outside_task(story: Story, title: str, *flags: str) -> int:
    return story.new_row_id(f'task make "{title}" --environment main {" ".join(flags)}'.strip(), actor=story.user)


def plan_task(story: Story, title: str, phase_id: int, *flags: str) -> int:
    task_id = outside_task(story, title, *flags)
    story.run(f"phase place {task_id} --phase {phase_id}", actor=story.user)
    return task_id
