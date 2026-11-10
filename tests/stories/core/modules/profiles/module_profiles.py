import json

import pytest

from engine.database.database import Database
from core.base.registry.registry import Registry
from core.modules.profiles.support.profile_files import ProfileFiles
from tests.stories.core.support.fixtures import UserJoined

MODULES = "tests.stories.core.modules.profiles.support.profile_modules"


@pytest.mark.parametrize(("module", "message"), [
    ("DuplicateProfile", "both register the profile journal-researcher"),
    ("UnknownType", "missing-type is no agent type: no installed module registers it"),
    ("WritingProfile", "profile module-reader asks for writing, and a Read-only helper only reads"),
    ("MissingDescription", "profile module-reader has no description"),
    ("MissingBody", "profile module-reader has no body"),
    ("InvalidName", "bad name cannot name a profile"),
    ("MissingDefault", "default profile missing-profile is not registered"),
    ("WrongDefaultType", "default profile module-reader has type helper, not clerk"),
    ("LegacyProfiles", "register profiles on the module, not the suite"),
])
def test_sync_refuses_invalid_profile_declarations_without_changing_the_registry(new_story, module, message):
    story = new_story()
    story.expect_sync_refusal(f"{MODULES}:{module}", message)


def test_a_module_that_is_no_suite_registers_a_profile_and_keeps_its_origin(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_sync_success(f"{MODULES}:ProfileModule")
    story.container.get(ProfileFiles).publish()
    rows = json.loads(story.run("profile list --json").output_text)["rows"]
    profile = next(row for row in rows if row["name"] == "module-reader")
    story.expect_rows(profile["agent_type"] == "helper", profile["module"] == "sample.profiles", profile["shipped"])
    registered = Registry.read(story.container.get(Database)).profile("module-reader")
    story.expect_rows(registered.module == "sample.profiles", registered.profile.body == "Read the files.")


def test_shipped_profiles_have_registered_types_and_independent_review(new_story):
    story = new_story()
    registry = Registry.read(story.container.get(Database))
    for name in ("journal-researcher", "journal-planner", "journal-debugger", "journal-plan-reviewer", "journal-code-reviewer"):
        story.expect_rows(registry.profile(name).profile.agent_type == "helper")
    for name in ("journal-senior", "journal-medior", "journal-worker"):
        story.expect_rows(registry.profile(name).profile.agent_type == "worker")
    story.expect_rows(registry.profile("journal-plan-reviewer").profile.independent,
                      registry.helper_type_book().find("worker").default_profile == "journal-worker")


def test_the_shipped_code_reviewer_reads_the_diff_itself_and_files_critical_tasks(new_story):
    story = new_story()
    reviewer = Registry.read(story.container.get(Database)).profile("journal-code-reviewer").profile
    story.expect_rows(reviewer.agent_type == "helper", "git diff <range>" in reviewer.body, "--priority critical" in reviewer.body, "journal task overview <n>" in reviewer.body)


def test_the_planner_profile_says_a_plan_is_written_thoroughly(new_story):
    story = new_story()
    planner = Registry.read(story.container.get(Database)).profile("journal-planner").profile.body
    story.expect_rows("one task per step a person could check" in planner, "plans.one-task-phase" in planner, "you may run journal plan edit" in planner,
                      "skill journal-planning" in planner, "skill journal-plan-review-applying" in planner)


def test_a_third_party_module_brings_a_type_a_driver_and_a_profile(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_sync_success(f"{MODULES}:ClerkModule")
    story.expect_text("profile list", "sample-clerk", "clerk")
