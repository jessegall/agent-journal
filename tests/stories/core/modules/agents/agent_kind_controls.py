import json
import shlex

from core.modules.helpers.support.agent_admission import AgentAdmission
from core.modules.helpers.support.agent_options import AgentOptions
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.support.main_controls_fixture import in_environment
from tests.stories.support.story_checks import expect_absent_value, expect_value

OPTIONS = "journal.core.helpers.agent-options"
ALLOWED_MODELS = "journal.core.helpers.allowed-models"


def set_options(story, *lines: str, scope: str = "--environment main") -> None:
    story.expect_success(f"setting set {OPTIONS} {shlex.quote(json.dumps(list(lines)))} {scope}", actor=story.user)


def new_reasons(story, agent_type: str, profile: str = "") -> list[str]:
    with in_environment(story):
        return story.container.get(AgentAdmission).new_reasons(agent_type, profile)


def test_s11_inheritance_without_options_allows_every_type_and_profile(new_story):
    story = new_story(fixture=BuilderWithUser)
    with in_environment(story):
        reading = story.container.get(AgentOptions).reading("worker", "journal-worker")
    expect_value((reading.source, reading.problems, reading.options.allow_new, reading.options.allowed_profiles), ("default", (), True, None))
    expect_absent_value(new_reasons(story, "worker", "journal-worker") + new_reasons(story, "helper", "journal-merger"))


def test_s11_inheritance_a_profile_line_wins_over_its_type_only_for_its_own_fields(new_story):
    story = new_story(fixture=BuilderWithUser)
    set_options(story, "helper allow_new=off", "helper:journal-merger allow_new=on")
    expect_absent_value(new_reasons(story, "helper", "journal-merger"))
    expect_value(new_reasons(story, "helper", "journal-researcher"), ["new helper sessions are switched off"])
    expect_absent_value(new_reasons(story, "worker", "journal-worker"))


def test_s13_inheritance_an_empty_allowed_profiles_list_denies_all_and_a_missing_one_allows_all(new_story):
    story = new_story(fixture=BuilderWithUser)
    set_options(story, "worker allowed_profiles=")
    expect_value(new_reasons(story, "worker", "journal-worker"), ["worker may not use the profile journal-worker"])
    set_options(story, "worker allowed_profiles=journal-worker")
    expect_absent_value(new_reasons(story, "worker", "journal-worker"))
    expect_value(new_reasons(story, "worker", "other-profile"), ["worker may not use the profile other-profile"])


def test_s12_inheritance_the_environment_list_replaces_the_project_list_and_names_its_source(new_story):
    story = new_story(fixture=BuilderWithUser)
    set_options(story, "helper allow_new=off", scope="--project")
    expect_value(new_reasons(story, "helper", "journal-researcher"), ["new helper sessions are switched off"])
    set_options(story, "worker allow_resume=off")
    with in_environment(story):
        reading = story.container.get(AgentOptions).reading("helper", "journal-researcher")
    expect_value((reading.source, reading.options.allow_new), ("environment", True))


def test_s52_inheritance_provider_and_model_restrictions_intersect_and_never_widen(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {ALLOWED_MODELS} {shlex.quote(json.dumps(['claude opus', 'codex gpt']))} --environment main", actor=story.user)
    set_options(story, "worker allowed_providers=claude", "worker allowed_models=claude:opus")
    with in_environment(story):
        admission = story.container.get(AgentAdmission)
        reasons = [admission.model_reasons("worker", "journal-worker", provider, model) for provider, model in [("claude", "opus"), ("claude", "haiku"), ("codex", "gpt")]]
    expect_value(reasons[0], [])
    expect_value(len(reasons[1]), 2)
    expect_value(len(reasons[2]), 2)


def test_s61_invalid_legacy_policy_is_readable_and_repairable_inheritance(new_story):
    story = new_story(fixture=BuilderWithUser)
    set_options(story, "worker allow_new=maybe")
    with in_environment(story):
        reading = story.container.get(AgentOptions).reading("worker", "journal-worker")
        resume = story.container.get(AgentAdmission).resume_reasons("helper", "journal-researcher")
    expect_value((len(reading.problems), reading.options.allow_new, len(resume)), (1, False, 2))
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 3 --environment main", actor=story.user)
    set_options(story, "worker allow_new=on")
    expect_absent_value(new_reasons(story, "worker", "journal-worker"))
