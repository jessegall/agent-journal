from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

PROFILE_MODULE = "tests.stories.core.modules.profiles.support.profile_modules:ProfileModule"


def checkout_with_a_checked_worker(story):
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    return repository, worker


def test_a_publish_commits_the_copies_it_writes_and_leaves_the_checkout_clean(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository, _ = checkout_with_a_checked_worker(story)
    code, report = story.synced_with(PROFILE_MODULE)
    story.run_listeners()
    committed = repository.git("show", "--name-only", "--format=%s", "HEAD").stdout
    story.expect_rows(code == 0, repository.git("status", "--porcelain").stdout == "", committed.startswith("Journal publishes"), ".claude/skills/" in committed, detail=f"{report}\n{committed}")


def test_a_worker_merge_succeeds_right_after_a_publish(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository, worker = checkout_with_a_checked_worker(story)
    story.synced_with(PROFILE_MODULE)
    story.run_listeners()
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: completed")
