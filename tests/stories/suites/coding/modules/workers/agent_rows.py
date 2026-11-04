import json

from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def test_an_ended_worker_waiting_for_a_job_shows_in_the_idle_agents_list(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task cancel 1 --reason "Withdrawn"', actor=story.agent)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    idle = json.loads(story.run("agent cards --environment main --helpers --show idle --json", actor=story.agent).output_text)["rows"]
    assert [row["id"] for row in idle] == [worker.id]
