from core.base.query.queries import Queries
from core.modules.messages.models.message import Message
from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.plugins.support.event_stories import install_event_plugin
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

MERGE_REQUEST_KEY = "suites.coding.workers.merge_request.created"


def guarded_merge_story(new_story, script: str):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    install_event_plugin(story, {"event": MERGE_REQUEST_KEY, "guard": script})
    return story, repository, worker


def test_a_plugin_guard_refuses_a_merge_before_anything_is_merged_and_the_worker_gets_the_findings(new_story):
    story, repository, worker = guarded_merge_story(new_story, "refuse.sh")
    target_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_text(f"worker merge --wait {worker.id}", "was refused before anything was merged", "not today", actor=story.agent)
    story.expect_rows(repository.tip(ENVIRONMENT_BRANCH) == target_tip)
    job = story.container.get(Queries).query(Message).newest().first()
    story.expect_rows(job is not None and "was refused before anything was merged" in job.text and "not today" in job.text)


def test_a_plugin_guard_that_allows_lets_the_merge_through_with_both_ends_recorded(new_story):
    story, repository, worker = guarded_merge_story(new_story, "see.sh")
    target_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    story.expect_rows(repository.tip(ENVIRONMENT_BRANCH) != target_tip)
    story.expect_text("merge-request list --json", f'"target_commit": "{target_tip}"', f'"worker_id": {worker.id}', actor=story.user)
