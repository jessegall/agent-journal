from core.base.actor import CORE_ACTOR_ID
import pytest

from core.testing.fake_launcher import FakeLauncher
from core.base.change.event_log import EventLog
from core.base.database.database import Database
from core.modules.profiles.support.profile_files import ProfileFiles
from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_PROFILES

from core.testing.hook_samples import HookSamples
from server.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.support.story_checks import expect_value
from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES)

SAVE_PROFILE = 'profile save critic --description "Reads a change and says what is wrong" --body "Read the diff." --reason needed'


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
    expect_value(names, {profile.name for profile in SHIPPED_PROFILES})
    story.expect_rows((story.home.project_folder / ".agents/profiles/critic.md").is_file())


def test_a_saved_profile_that_names_no_model_uses_the_settings_without_freezing_them(new_story):
    story = saved_profile_story(new_story)
    path = story.home.project_folder / ".agents/profiles/critic.md"
    story.expect_rows('model: ""' in path.read_text())
    story.expect_success("setting set journal.core.profiles.model-claude haiku --project", actor=story.user)
    story.expect_text("profile list", "critic  helper  haiku  used 0", actor=story.user)


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


def test_only_a_person_can_save_a_profile_and_its_effective_model_is_listed(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal(SAVE_PROFILE, "A person was asked in the dock", actor=story.agent)
    request = story.container.get(Queries).query(ApprovalRequest).first()
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    story.expect_text("profile list", "critic  helper  sonnet  used 0", actor=story.user)


def test_a_bad_name_a_bad_type_or_no_description_is_refused(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal('profile save "no good" --description "x"', "no good cannot name a profile", actor=story.user)
    story.expect_refusal('profile save critic --description "x" --type boss', "boss is no agent type: no installed module registers it", actor=story.user)
    story.expect_refusal("profile save critic", "a profile needs a description", actor=story.user)


def test_saving_a_shipped_profile_with_only_a_program_keeps_its_description_and_body(new_story):
    story = new_story(fixture=BuilderWithUser)
    before = story.container.get(ProfileFiles).effective("journal-merger")
    story.expect_success("profile save journal-merger --program codex", actor=story.user)
    after = story.container.get(ProfileFiles).effective("journal-merger")
    story.expect_rows(after.program == "codex", after.description == before.description, after.body == before.body, detail=str(after))


def test_native_module_profiles_are_published_for_codex_only_where_it_has_a_folder(new_story):
    story = saved_profile_story(new_story)
    expect_absent_exists_project_folder_2(story, ".codex", "agents", "journal-researcher.toml")
    (story.home.project_folder / ".codex").mkdir()
    story.container.get(ProfileFiles).publish()
    expect_project_folder_home_with(story, ".codex", "agents", "journal-researcher.toml", 'sandbox_mode = "read-only"')
    expect_absent_exists_project_folder_2(story, ".codex", "agents", "critic.toml")


def test_starting_a_helper_under_a_profile_counts_its_use(new_story):
    story = saved_profile_story(new_story)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.run('helper start critic --model haiku --brief "Find where totals are counted" --environment main', actor=story.agent)
    launcher.server.close()
    story.expect_text("profile list", "critic  helper  sonnet  used 1", actor=story.user)


def test_a_person_can_save_an_own_profile_under_a_journal_name(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success('profile save journal-mine --description "Mine" --body "Read."', "saved journal-mine in .agents/profiles/journal-mine.md", actor=story.user)


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
