from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def test_usage_bars_and_usage_show_with_several_workers_read_the_worker_work_once(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    first_task = 1
    task_ids = [first_task, *(story.new_row_id(f'task make "Part {number}" --brief "A part" --environment main', actor=story.agent) for number in range(2, 4))]
    for task_id in task_ids[:2]:
        story.expect_success(f"worker dispatch --model sonnet --fresh \"one each\" {task_id}", actor=story.agent)
    story.expect_success("usage bars --environment main", actor=story.user)
    story.expect_success("usage show --environment main", actor=story.user)
    story.expect_success("usage agents --environment main", actor=story.user)


def test_the_activity_of_workers_is_read_once_when_asked_again_in_one_request(new_story):
    from core.modules.usage.conditions.agent_activity import AgentActivity
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_success('worker dispatch --model sonnet 1', actor=story.agent)
    activity = story.container.get(AgentActivity)
    with story.repeated_work.request():
        for _ in range(3):
            activity.current()
        story.container.get(AgentActivity).current()


def test_each_usage_line_builds_the_worker_activity_once(new_story, monkeypatch):
    from core.modules.usage.conditions.agent_activity import AgentActivity
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_success('worker dispatch --model sonnet 1', actor=story.agent)
    builds = []
    current = AgentActivity.current
    monkeypatch.setattr(AgentActivity, "current", lambda activity: builds.append(activity) or current(activity))
    for line in ("usage bars", "usage show", "usage agents"):
        builds.clear()
        story.expect_success(f"{line} --environment main", actor=story.user)
        story.expect_rows(len(builds) == 1)
