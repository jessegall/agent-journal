from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment

ALLOWED_MODELS = "journal.suites.coding.workers.allowed-models"


def allow_opus(story) -> None:
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f'setting set {ALLOWED_MODELS} "claude opus" --project', actor=user)


def test_every_model_is_allowed_until_one_is_listed(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_text("worker models", "claude haiku: allowed", "claude sonnet: allowed", "claude opus: allowed")


def test_listing_models_allows_those_of_that_program_and_leaves_the_others_alone(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    allow_opus(story)
    story.expect_text("worker models", "claude sonnet: not allowed", "claude opus: allowed", "codex gpt-5.6-terra: allowed")


def test_a_worker_runs_on_the_general_model_when_it_is_allowed(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_text(DISPATCH, "--model sonnet", actor=story.agent)


def test_a_worker_runs_on_the_nearest_allowed_model_when_the_general_one_is_not(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    allow_opus(story)
    story.expect_text(DISPATCH, "--model opus", actor=story.agent)
