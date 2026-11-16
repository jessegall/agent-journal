import json
from core.modules.profiles.support.profile_files import ProfileFiles
from tests.stories.core.support.fixtures import UserJoined

from engine.enums.occupant import Occupant
from engine.registry.registry import Registry
from suites.coding.support.shipped_profiles import CODE_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import DEBUGGER_PROFILE
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_MEDIOR_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_SENIOR_PROFILE
import pytest

MODULES = "tests.stories.core.modules.profiles.support.profile_modules"


@pytest.mark.parametrize(("module", "message"), [
    ("DuplicateProfile", f"both register the profile {RESEARCHER_PROFILE.name}"),
    ("UnknownType", "missing-type is no agent type: no installed module registers it"),
    ("WritingProfile", "profile module-reader asks for writing, and a Read-only helper only reads"),
    ("MissingDescription", "profile module-reader has no description"),
    ("MissingBody", "profile module-reader has no body"),
    ("InvalidName", "bad name cannot name a profile"),
    ("MissingDefault", "default profile missing-profile is not registered"),
    ("WrongDefaultType", "default profile module-reader has type helper, which clerk does not extend"),
    ("LegacyProfiles", "register profiles on the module, not the suite"),
    ("MissingBase", "profile module-reader names the base no-such-base, which no module registers"),
    ("LoopingBases", "the bases of profile module-reader lead back to it: module-reader -> module-writer -> module-reader"),
])
def test_sync_refuses_invalid_profile_declarations_without_changing_the_registry(journal, module, message):
    journal.expect_sync_refusal(f"{MODULES}:{module}", message)


def test_shipped_profiles_have_registered_types_and_the_plan_reviewer_is_each_launch(journal):
    registry = Registry.read(journal.database)
    for name in (f"{RESEARCHER_PROFILE.name}", f"{PLANNER_PROFILE.name}", f"{DEBUGGER_PROFILE.name}", f"{PLAN_REVIEWER_PROFILE.name}", f"{CODE_REVIEWER_PROFILE.name}"):
        assert registry.profile(name).profile.agent_type == 'helper'
    for name in (f"{WORKER_SENIOR_PROFILE.name}", f"{WORKER_MEDIOR_PROFILE.name}", f"{WORKER_PROFILE.name}"):
        assert registry.profile(name).profile.agent_type == 'worker'
    assert registry.profile(f'{PLAN_REVIEWER_PROFILE.name}').profile.occupant is Occupant.LAUNCH_ROTATION
    assert registry.helper_type_book().find('worker').default_profile == f'{WORKER_MEDIOR_PROFILE.name}'
    assert registry.profile(f'{WORKER_PROFILE.name}').profile.is_base


def test_the_shipped_code_reviewer_reads_the_diff_itself_and_files_critical_tasks(journal):
    reviewer = Registry.read(journal.database).profile(f"{CODE_REVIEWER_PROFILE.name}").profile
    assert reviewer.agent_type == 'helper'
    assert 'git diff <range>' in reviewer.body
    assert '--priority critical' in reviewer.body
    assert 'journal task overview <n>' in reviewer.body


def test_the_planner_profile_says_a_plan_is_written_thoroughly(journal):
    planner = Registry.read(journal.database).profile(f"{PLANNER_PROFILE.name}").profile.body
    assert 'one task per step a user could check' in planner
    assert 'plans.one-task-phase' in planner
    assert 'you may run journal plan edit' in planner
    assert 'skill journal-planning' in planner
    assert 'skill journal-plan-review-applying' in planner


def test_a_change_to_the_base_reaches_a_profile_built_on_it_with_its_own_lines_added_after(journal):
    journal.expect_sync_success(f"{MODULES}:BasedProfiles")
    based = Registry.read(journal.database).profile("sample-based").profile
    assert based.body == 'Read the files.\n\nAnswer in one line.'
    assert based.model == 'opus'
    assert based.skills == ('journal',)
    assert based.base == 'sample-base'
    journal.expect_sync_success(f"{MODULES}:ChangedBase")
    based = Registry.read(journal.database).profile("sample-based").profile
    assert based.body == 'Read the files twice.\n\nAnswer in one line.'


MODULES = "tests.stories.core.modules.profiles.support.profile_modules"


def test_a_module_that_is_no_suite_registers_a_profile_and_keeps_its_origin(played):
    story = played(UserJoined)
    story.expect_sync_success(f"{MODULES}:ProfileModule")
    story.container.get(ProfileFiles).publish()
    rows = json.loads(story.run("profile list --json").output_text)["rows"]
    profile = next(row for row in rows if row["name"] == "module-reader")
    story.expect_rows(profile["agent_type"] == "helper", profile["module"] == "sample.profiles", profile["shipped"])
    registered = story.registry().profile("module-reader")
    story.expect_rows(registered.module == "sample.profiles", registered.profile.body == "Read the files.")
