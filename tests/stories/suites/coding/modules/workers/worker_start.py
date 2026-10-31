from core.base.journal_home import LAUNCHER_SOCKET
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment
from tests.stories.suites.coding.modules.workers.support.fake_launcher import FakeLauncher


def test_a_dispatch_with_the_launcher_running_hands_it_the_worker_to_start_in_its_worktree(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET))
    worker_id = story.new_row_id(DISPATCH, actor=story.agent)
    story.run_listeners()
    launcher.expect_worker(worker_id, repository.worktree_folder(worker_id))


def test_a_dispatch_with_no_launcher_prints_the_command_line_that_starts_the_worker(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_text(DISPATCH, "start the worker with: cd ", str(repository.folder / ".journal" / "worktrees" / "main"), actor=story.agent)
