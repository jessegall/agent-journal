from core.base.actor import CORE_ACTOR_ID
import pytest
from core.base.change.event_log import EventLog
from core.base.database.database import Database
from core.modules.profiles.support.profile_files import ProfileFiles
from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_PROFILES

from core.testing.hook_samples import HookSamples
from server.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.support.story_checks import expect_value

SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES)

SAVE_PROFILE = 'profile save critic --description "Reads a change and says what is wrong" --body "Read the diff."'


def agents_folder(story):
    return story.home.project_folder / ".claude" / "agents"


def saved_profile_story(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(SAVE_PROFILE, actor=story.user)
    return story


@pytest.fixture
def profiles_missing(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run_listeners()
    for profile in SHIPPED_PROFILES:
        (agents_folder(story) / f"{profile.name}.md").unlink(missing_ok=True)
    return story


def test_the_journal_writes_its_own_profiles_at_every_start_and_keeps_a_saved_one(new_story):
    story = saved_profile_story(new_story)
    (agents_folder(story) / "journal-gone.md").parent.mkdir(parents=True, exist_ok=True)
    (agents_folder(story) / "journal-gone.md").write_text("an old profile")
    story.container.get(ProfileFiles).publish()
    names = {path.stem for path in agents_folder(story).glob("*.md")}
    expect_value(names, {*(profile.name for profile in SHIPPED_PROFILES), "critic"})


def test_a_saved_profile_that_names_no_model_leaves_the_model_out_of_its_files(new_story):
    story = new_story(fixture=BuilderWithUser)
    (story.home.project_folder / ".codex").mkdir(parents=True, exist_ok=True)
    story.expect_success(SAVE_PROFILE, actor=story.user)
    claude_file = (agents_folder(story) / "critic.md").read_text()
    codex_file = (story.home.project_folder / ".codex" / "agents" / "critic.toml").read_text()
    story.expect_rows("model:" not in claude_file, "codex-model:" not in claude_file, "model =" not in codex_file)
    story.expect_success(SAVE_PROFILE + " --model haiku", actor=story.user)
    story.expect_rows("model: haiku" in (agents_folder(story) / "critic.md").read_text())


def test_a_module_sync_writes_the_journals_own_profiles(profiles_missing):
    story = profiles_missing
    with story.container.get(Database).transaction():
        story.container.get(EventLog).write_registry_sync(CORE_ACTOR_ID, "a new fingerprint", story.clock.timestamp().text)
    story.run_listeners()
    expect_file_agents_folder(story, "journal-senior.md")


def test_the_journals_start_writes_its_own_profiles(profiles_missing):
    story = profiles_missing
    BootingWork().run(story.container)
    story.run_listeners()
    expect_file_agents_folder(story, "journal-senior.md")


def test_a_shipped_profile_names_its_own_model_for_each_program_whatever_the_setting_says(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.profiles.model-claude haiku --project", actor=story.user)
    story.container.get(ProfileFiles).publish()
    expect_agents_folder_journal_with(story, "journal-researcher.md", "model: sonnet")
    expect_agents_folder_journal_with(story, "journal-senior.md", "model: opus")
    expect_profile_model(SHIPPED_PROFILES)


def test_a_saved_profile_is_listed_whether_a_person_or_an_agent_saved_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(SAVE_PROFILE, "saved critic in .claude/agents/critic.md", actor=story.agent)
    story.expect_success(SAVE_PROFILE, "saved critic in .claude/agents/critic.md", actor=story.user)
    story.expect_text("profile list", "critic  helper  -  used 0", actor=story.user)


def test_a_bad_name_a_bad_type_or_no_description_is_refused(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal('profile save "no good" --description "x"', "no good cannot name a profile", actor=story.user)
    story.expect_refusal('profile save critic --description "x" --type boss', "boss is no agent type: no installed module registers it", actor=story.user)
    story.expect_refusal("profile save critic", "a profile needs a description", actor=story.user)


def test_codex_gets_a_toml_only_where_it_has_a_folder(new_story):
    story = saved_profile_story(new_story)
    expect_absent_exists_project_folder_2(story, ".codex", "agents", "critic.toml")
    (story.home.project_folder / ".codex").mkdir()
    story.expect_success(SAVE_PROFILE, actor=story.user)
    expect_project_folder_home_with(story, ".codex", "agents", "critic.toml", 'sandbox_mode = "read-only"')


def test_starting_a_subagent_under_a_profile_counts_its_use(new_story):
    story = saved_profile_story(new_story)
    start = HookSamples.subagent().with_raw({"tool_input": {"model": "haiku", "description": "Read the cart", "prompt": "Find where totals are counted", "subagent_type": "critic"}})
    story.hook("s-1", start)
    story.expect_text("profile list", "critic  helper  -  used 1", actor=story.user)


def test_a_person_cannot_save_a_profile_under_a_shipped_name(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal('profile save journal-mine --description "Mine" --body "Read."', "a profile starting with journal- is reserved", actor=story.user)


def expect_project_folder_home_with(story, text, text_2, text_3, expected) -> None:
    actual = (story.home.project_folder / text / text_2 / text_3).read_text()
    assert expected in actual, actual


def expect_absent_exists_project_folder_2(story, text, text_2, text_3) -> None:
    actual = (story.home.project_folder / text / text_2 / text_3).exists()
    assert not actual, actual


def expect_profile_model(item) -> None:
    actual = all((profile.model and profile.codex_model for profile in item))
    assert actual, actual


def expect_agents_folder_journal_with(story, text, expected) -> None:
    actual = (agents_folder(story) / text).read_text()
    assert expected in actual, actual


def expect_file_agents_folder(story, text) -> None:
    actual = (agents_folder(story) / text).is_file()
    assert actual, actual
