from engine.actor.actor import CORE_ACTOR_ID
import pytest

from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.event.event_log import EventLog
from engine.database.database import Database
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.drivers.support.reviewer_start import REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_PROFILES

from engine.testing.examples.hook_samples import HookSamples
from server.work.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value
from engine.registry.registry import Registry
from core.modules.approvals.models.approval_request import ApprovalRequest
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client
from core.modules.profiles.support.profile_settings import CLAUDE_MODEL_SETTING
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_SENIOR_PROFILE

SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES, REVIEWER_PROFILE)

SAVE_PROFILE = 'profile save critic --description "Reads a change and says what is wrong" --body "Read the diff." --reason needed'


def agents_folder(story):
    return story.home.project_folder / ".claude" / "agents"


def saved_profile_story(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(SAVE_PROFILE, actor=story.user)
    return story


@pytest.fixture
def profiles_missing(new_story):
    story = new_story(fixture=UserBuilder)
    story.run_listeners()
    for profile in SHIPPED_PROFILES:
        (agents_folder(story) / f"{profile.name}.md").unlink(missing_ok=True)
    return story




def test_a_saved_profile_that_names_no_model_uses_the_settings_without_freezing_them(new_story):
    story = saved_profile_story(new_story)
    path = story.home.project_folder / ".agents/profiles/critic.md"
    story.expect_rows('model: ""' in path.read_text())
    story.expect_success(f"setting set {CLAUDE_MODEL_SETTING} haiku --project", actor=story.user)
    story.expect_text("profile list", "critic  helper  haiku  used 0", actor=story.user)








def test_only_a_person_can_save_a_profile_and_its_effective_model_is_listed(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal(SAVE_PROFILE, "A user was asked in the dock", actor=story.agent)
    request = story.first_row(ApprovalRequest)
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(request.id)])
    story.expect_text("profile list", "critic  helper  sonnet  used 0", actor=story.user)


def test_a_bad_name_a_bad_type_or_no_description_is_refused(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal('profile save "no good" --description "x"', "no good cannot name a profile", actor=story.user)
    story.expect_refusal('profile save critic --description "x" --type boss', "boss is no helper type: no installed module or suite registers it", actor=story.user)
    story.expect_refusal("profile save critic", "a profile needs a description", actor=story.user)






def test_starting_a_helper_under_a_profile_counts_its_use(new_story):
    story = saved_profile_story(new_story)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.run('helper start critic --model haiku --brief "Find where totals are counted" --environment main', actor=story.agent)
    launcher.server.close()
    story.expect_text("profile list", "critic  helper  sonnet  used 1", actor=story.user)


def test_a_person_can_save_an_own_profile_under_a_journal_name(new_story):
    story = new_story(fixture=UserBuilder)
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


