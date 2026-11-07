import shutil

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.journal_home import JournalHome
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.providers import Providers
from core.modules.helpers.support.helper_programs import HelperPrograms
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment

ALLOWED_MODELS = "journal.core.helpers.allowed-models"


def allow_opus(story) -> None:
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f'setting set {ALLOWED_MODELS} "claude opus" --project', actor=user)


def test_every_model_is_allowed_until_one_is_listed(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_text("worker models", "claude haiku: allowed", "claude sonnet: allowed", "claude opus: allowed")


def test_each_program_lists_its_models_from_the_cheapest_to_the_one_for_rare_occasions(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.expect_text("worker models", "claude haiku: allowed\nclaude sonnet: allowed\nclaude opus: allowed\nclaude fable: allowed",
                      "codex gpt-6-luna: allowed\ncodex gpt-6.1-terra: allowed\ncodex gpt-6.1-sol: allowed\ncodex gpt-6-astra: allowed")


def test_listing_models_allows_those_of_that_program_and_leaves_the_others_alone(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    allow_opus(story)
    story.expect_text("worker models", "claude sonnet: not allowed", "claude opus: allowed", "codex gpt-6.1-terra: allowed")


def test_the_models_window_saves_the_models_left_with_the_line_it_sends(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.run('actor make user "Ada"')
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.viewer_line_value(cookie, {"window": "workers.models", "environment": "main", "line": ["setting", "set", ALLOWED_MODELS, "claude sonnet,claude opus,codex gpt-6.1-terra", "--project"]})
        rows = server.viewer_line_value(cookie, {"window": "workers.models", "environment": "main", "line": ["worker", "models"]})["rows"]
    story.expect_rows({row["id"]: row["allowed"] for row in rows} == {"claude haiku": False, "claude sonnet": True, "claude opus": True, "claude fable": False,
                                                                       "codex gpt-6-luna": False, "codex gpt-6.1-terra": True, "codex gpt-6.1-sol": False, "codex gpt-6-astra": False})


def test_a_worker_for_a_program_that_is_not_installed_is_refused_before_any_worktree_is_cut(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.container.bind(HelperPrograms, HelperPrograms(story.container.get(JournalHome), story.container.get(Providers), story.container.get(ManagedHooks)))
    monkeypatch.setattr(shutil, "which", lambda name: None)
    story.expect_refusal(DISPATCH, "claude is not installed here", actor=story.agent)
    story.expect_success("worker-worktree list", "nothing found")
    story.expect_success("agent list --role worker", "nothing found")
    repository.expect_no_worktree()


def test_a_worker_runs_on_the_general_model_when_it_is_allowed(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_text(DISPATCH, "--model sonnet", actor=story.agent)


def test_a_model_that_is_not_allowed_is_refused_and_an_allowed_one_runs(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    allow_opus(story)
    story.expect_refusal(DISPATCH, "may run: opus", actor=story.agent)
    story.expect_text("worker dispatch --model opus 1", "--model opus", actor=story.agent)
