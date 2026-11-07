import json
import shlex

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask, BuilderWithUser
from tests.stories.suites.coding.main_file_permissions import MAIN_SESSION, PROJECT_FILE
from tests.stories.support.story_checks import expect_value

AUTO = "journal.suites.coding.auto-mode"
PROFILE_LIMITS = "journal.core.helpers.helper-profile-limits"
MERGE_COMMANDS = "journal.suites.coding.workers.merge-commands"
RUN_LIMIT = "journal.suites.coding.workers.worker-run-limit"


def test_old_builder_auto_off_keeps_its_value_and_still_lets_the_main_agent_edit(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_text(f"setting show {AUTO} --environment main", "value: False", actor=story.user)
    story.expect_hook_allowed(MAIN_SESSION, HookSamples.edit(PROJECT_FILE))


def test_s50_a_fresh_environment_reads_auto_from_its_declared_default(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_text(f"setting show {AUTO} --environment main", "from: default", actor=story.user)


def test_s50_explicit_limits_and_merge_commands_stay_as_set(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {PROFILE_LIMITS} {shlex.quote(json.dumps(['journal-merger:1:2']))} --environment main", actor=story.user)
    story.expect_success(f"setting set {MERGE_COMMANDS} {shlex.quote(json.dumps(['git push']))} --project", actor=story.user)
    story.expect_success(f"setting set {RUN_LIMIT} 3 --environment main", actor=story.user)
    story.expect_text(f"setting show {PROFILE_LIMITS} --environment main", "journal-merger:1:2", actor=story.user)
    story.expect_text(f"setting show {MERGE_COMMANDS} --environment main", "git push", actor=story.user)
    expect_value(story.run(f"setting show {RUN_LIMIT} --environment main", story.user).output_text.count("3"), 1)
