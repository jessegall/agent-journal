from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


def test_a_merge_conflict_names_three_long_paths_whole_to_the_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    paths = tuple(f"src/core/modules/processes/support/reader_requests/{name}/conflicting_process_reader.py"
                  for name in ("first_reader", "second_reader", "third_reader"))
    repository.checkout(ENVIRONMENT_BRANCH)
    for path in paths:
        (repository.folder / path).parent.mkdir(parents=True, exist_ok=True)
        repository.committed(path, "TOTAL = 0\n", "Add a reader")
    worker = checked_worker(story, repository)
    for path in paths:
        repository.changed(worker.id, path, "TOTAL = 1\n")
        repository.committed(path, "TOTAL = 2\n", "Change a reader")
    story.expect_text(f"worker merge --wait {worker.id}", "clashed on", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", *paths, "then journal worker deliver")
