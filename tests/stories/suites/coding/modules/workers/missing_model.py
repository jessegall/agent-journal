from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment


def test_a_worker_without_a_recorded_model_is_not_resumed_on_a_different_model(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    worker = checked_worker(story, repository_environment(story))
    story.expect_success(f"agent edit {worker.id} --program-model ''")
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.run_listeners()
    story.expect_success(f'worker send --wait {worker.id} "Add the tax"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(f"worker {worker.id} has no recorded model" in story.system_log_text())
