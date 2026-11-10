from engine.query.queries import Queries
from core.modules.messages.models.message import Message
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.plugins.support.event_stories import install_event_plugin
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

MERGE_REQUEST_KEY = "suites.coding.workers.merge_request.created"


def guarded_merge_story(new_story, script: str, **entry: object):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    install_event_plugin(story, {"event": MERGE_REQUEST_KEY, "guard": script, **entry}, scripts={"slow.sh": "sleep 5"})
    return story, repository, worker


def test_a_plugin_guard_refuses_a_merge_before_anything_is_merged_and_the_worker_gets_the_findings(new_story):
    story, repository, worker = guarded_merge_story(new_story, "refuse.sh")
    target_tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_text(f"worker merge --wait {worker.id}", "was refused before anything was merged", "not today", actor=story.agent)
    story.expect_rows(repository.tip(ENVIRONMENT_BRANCH) == target_tip)
    job = story.container.get(Queries).query(Message).newest().first()
    story.expect_rows(job is not None and "was refused before anything was merged" in job.text and "not today" in job.text)
