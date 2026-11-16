from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.gone_workers import start_launcher
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from suites.coding.modules.workers.support.worker_settings import MAIN_MERGES_WORKERS, WORKERS_START_HELPERS
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE


def test_a_worker_that_may_not_start_helpers_and_a_main_agent_that_may_not_merge_are_refused_at_their_commands_themselves(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"setting set {WORKERS_START_HELPERS} false --environment main", actor=story.user)
    start_launcher(story, b"started 4242\n")
    story.expect_refusal(f'helper start {RESEARCHER_PROFILE.name} --brief "Read src/cart.py" --environment main', "A worker starts no read-only helper here", actor=worker)
    repository.checkout(ENVIRONMENT_BRANCH)
    request_merge(story, worker)
    story.expect_success(f"setting set {MAIN_MERGES_WORKERS} false --environment main", actor=story.user)
    story.expect_refusal(f"worker merge --wait {agent_number(story, worker.id)}", "The main agent merges no worker here", actor=story.agent)
