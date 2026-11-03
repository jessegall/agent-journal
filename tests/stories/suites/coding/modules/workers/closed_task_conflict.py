import pytest

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


@pytest.mark.parametrize("command,notice", [("worker merge {worker}", "clashed on cart.py"),
                                           ('worker send {worker} "Finish the total"', "takes the job")])
def test_a_conflict_reopens_the_closed_task_before_asking_the_worker_to_edit(new_story, command, notice):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success('task close 1 --outcome "tests passed"', actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(command.format(worker=worker.id), notice, actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", "clashes on cart.py")
    story.expect_text("task show 1", "state: started", f"holder_id: {worker.id}")
    path = repository.worktree_folder(worker.id) / "cart.py"
    story.expect_hook_allowed(worker_session(story, worker), HookSamples.edit(str(path)))
    path.write_text("TOTAL = 3\n")
    story.expect_success("worker deliver", actor=worker)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")
