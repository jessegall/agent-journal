from tests.stories.core.modules.profiles.profiles import expect_agents_folder_journal_with
from tests.stories.core.modules.profiles.profiles import expect_project_folder_home_with
from engine.actor.actor import CORE_ACTOR_ID
import pytest

from engine.event.event_log import EventLog
from engine.database.database import Database
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.drivers.support.reviewer_start import REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_PROFILES

from server.work.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value
from engine.registry.registry import Registry
from core.modules.profiles.support.profile_settings import CLAUDE_MODEL_SETTING
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_SENIOR_PROFILE

SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES, REVIEWER_PROFILE)

SAVE_PROFILE = 'profile save critic --description "Reads a change and says what is wrong" --body "Read the diff." --reason needed'


def agents_folder(story):
    return story.home.project_folder / ".claude" / "agents"


def saved_profile_story(played):
    story = played(UserBuilder)
    story.expect_success(SAVE_PROFILE, actor=story.user)
    return story


@pytest.fixture
def profiles_missing(played):
    story = played(UserBuilder)
    story.run_listeners()
    for profile in SHIPPED_PROFILES:
        (agents_folder(story) / f"{profile.name}.md").unlink(missing_ok=True)
    return story


def test_the_journal_writes_its_own_profiles_at_every_start_and_keeps_a_saved_one(played):
    story = saved_profile_story(played)
    (agents_folder(story) / "journal-gone.md").parent.mkdir(parents=True, exist_ok=True)
    (agents_folder(story) / "journal-gone.md").write_text("an old profile")
    story.container.get(ProfileFiles).publish()
    names = {path.stem for path in agents_folder(story).glob("*.md")}
    expect_value(names, {profile.name for profile in SHIPPED_PROFILES})
    story.expect_rows((story.home.project_folder / ".agents/profiles/critic.md").is_file())


def test_a_module_sync_writes_the_journals_own_profiles(profiles_missing):
    story = profiles_missing
    with story.container.get(Database).transaction():
        story.container.get(EventLog).write_registry_sync(CORE_ACTOR_ID, "a new fingerprint", story.clock.timestamp().text)
    story.run_listeners()
    expect_value(bool((agents_folder(story) / f'{WORKER_SENIOR_PROFILE.name}.md').is_file()), True)


def test_the_journals_start_writes_its_own_profiles(profiles_missing):
    story = profiles_missing
    BootingWork().run(story.container)
    story.run_listeners()
    expect_value(bool((agents_folder(story) / f'{WORKER_SENIOR_PROFILE.name}.md').is_file()), True)


def test_a_shipped_profile_names_its_own_model_for_each_program_whatever_the_setting_says(played):
    story = played(UserBuilder)
    story.expect_success(f"setting set {CLAUDE_MODEL_SETTING} haiku --project", actor=story.user)
    story.container.get(ProfileFiles).publish()
    expect_agents_folder_journal_with(story, f"{RESEARCHER_PROFILE.name}.md", "model: sonnet")
    expect_agents_folder_journal_with(story, f"{WORKER_SENIOR_PROFILE.name}.md", "model: opus")
    expect_value(bool(all((profile.model and profile.codex_model for profile in SHIPPED_PROFILES))), True)


def test_saving_a_shipped_profile_with_only_a_program_keeps_its_description_and_body(played):
    story = played(UserBuilder)
    previous = story.container.get(ProfileFiles).effective(f"{MERGER_PROFILE.name}")
    story.expect_success(f"profile save {MERGER_PROFILE.name} --program codex", actor=story.user)
    after = story.container.get(ProfileFiles).effective(f"{MERGER_PROFILE.name}")
    story.expect_rows(after.program == "codex", after.description == previous.description, after.body == previous.body, detail=str(after))


def test_native_module_profiles_are_published_for_codex_only_where_it_has_a_folder(played):
    story = saved_profile_story(played)
    expect_value(bool((story.home.project_folder / '.codex' / 'agents' / f'{RESEARCHER_PROFILE.name}.toml').exists()), False)
    (story.home.project_folder / ".codex").mkdir()
    story.container.get(ProfileFiles).publish()
    expect_project_folder_home_with(story, ".codex", "agents", f"{RESEARCHER_PROFILE.name}.toml", 'sandbox_mode = "read-only"')
    expect_value(bool((story.home.project_folder / '.codex' / 'agents' / 'critic.toml').exists()), False)


def expect_absent_exists_project_folder_2(story, text, text_2, text_3) -> None:
    actual = (story.home.project_folder / text / text_2 / text_3).exists()
    assert not actual, actual


def expect_profile_model(item) -> None:
    actual = all((profile.model and profile.codex_model for profile in item))
    assert actual, actual


def expect_file_agents_folder(story, text) -> None:
    actual = (agents_folder(story) / text).is_file()
    assert actual, actual


def test_the_profiles_window_is_called_profiles_in_the_navigation(played):
    story = played(UserBuilder)
    titles = {window.name: window.title for window in story.container.get(Registry).windows}
    expect_value(titles["profiles.profiles"], "Profiles")
