import shlex

from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.support.main_options import BUILDER, ORCHESTRATOR
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.support.main_controls_fixture import scope_line
from tests.stories.support.story_checks import expect_value
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from suites.coding.support.coding_settings import KEEP_RUNNING_SETTING

AUTO = f"{AUTO_MODE_SETTING}"
CONTINUE_SETTING = f"{KEEP_RUNNING_SETTING}"
MERGER = f"{MERGER_ENABLED}"
WORKER_LIMIT = f"{WORKER_RUN_LIMIT}"


def main_options(story):
    with scope_line(story):
        return story.container.get(CodingMainOptions).options()


def test_s01_effective_main_options_start_from_the_declared_builder_bundle(new_story):
    story = new_story(fixture=UserBuilder)
    options = main_options(story)
    expect_value((options.bundle, options.workflow, options.problems), (BUILDER, "builder", ()))
    expect_value({source for _, source in options.sources}, {"default"})


def test_s61_invalid_legacy_policy_is_readable_and_repairable_effective_main_options(new_story):
    story = new_story(fixture=UserBuilder)
    story.run(f"setting make {AUTO} {shlex.quote(chr(34) + 'maybe' + chr(34))} --environment main")
    options = main_options(story)
    expect_value((options.auto, options.merger, options.workflow, len(options.problems)), (False, True, "custom", 1))
    story.expect_success(f"setting set {AUTO} on --environment main", actor=story.user)
    expect_value((main_options(story).workflow, main_options(story).problems), ("builder", ()))
