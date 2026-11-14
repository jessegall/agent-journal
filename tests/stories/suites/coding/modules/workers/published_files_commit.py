import pytest

from server.work.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

pytestmark = pytest.mark.real_git



def test_a_start_of_the_journal_commits_the_profile_and_skill_files_it_published_into_the_checkout(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    repository.checkout(ENVIRONMENT_BRANCH)
    BootingWork().run(story.container)
    story.run_listeners()
    subjects = repository.git("log", "--format=%s").stdout
    story.expect_rows("Journal publishes" in subjects, detail=subjects)
    story.expect_rows(repository.git("status", "--porcelain", ".claude", ".codex", ".agents").stdout == "")
