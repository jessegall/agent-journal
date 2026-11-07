import shlex

from suites.coding.support.coding_main_options import CodingMainOptions
from suites.coding.support.main_options import BUILDER, ORCHESTRATOR
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.suites.coding.support.main_controls_fixture import in_environment
from tests.stories.support.story_checks import expect_value

AUTO = "journal.suites.coding.auto-mode"
KEEP_GOING = "journal.suites.coding.continue-while-delegatable"
MERGER = "journal.suites.coding.workers.merger-on"
WORKER_LIMIT = "journal.suites.coding.workers.worker-run-limit"


def main_options(story):
    with in_environment(story):
        return story.container.get(CodingMainOptions).options()


def test_s01_effective_main_options_start_from_the_declared_builder_bundle(new_story):
    story = new_story(fixture=BuilderWithUser)
    options = main_options(story)
    expect_value((options.bundle, options.workflow, options.problems), (BUILDER, "builder", ()))
    expect_value({source for _, source in options.sources}, {"default"})


def test_s01_effective_main_options_name_the_environment_that_set_them(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_success(f"setting set {MERGER} off --project", actor=story.user)
    options = main_options(story)
    expect_value((options.auto, options.merger, dict(options.sources)[AUTO], dict(options.sources)[MERGER]), (False, False, "environment", "project"))


def test_s44_effective_workflow_is_derived_from_the_preset_owned_controls_only(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    expect_value(main_options(story).workflow, "custom")
    story.expect_success(f"setting set {KEEP_GOING} on --environment main", actor=story.user)
    expect_value(main_options(story).workflow, "custom")
    story.expect_success("setting set journal.suites.coding.main-writes-code off --environment main", actor=story.user)
    expect_value((main_options(story).bundle, main_options(story).workflow), (ORCHESTRATOR, "orchestrator"))
    story.expect_success(f"setting set {WORKER_LIMIT} 5 --environment main", actor=story.user)
    expect_value(main_options(story).workflow, "orchestrator")
    story.expect_success(f"setting set {AUTO} on --environment main", actor=story.user)
    story.expect_success(f"setting set {KEEP_GOING} off --environment main", actor=story.user)
    story.expect_success("setting set journal.suites.coding.main-writes-code on --environment main", actor=story.user)
    expect_value(main_options(story).workflow, "builder")


def test_s61_invalid_legacy_policy_is_readable_and_repairable_effective_main_options(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run(f"setting make {AUTO} {shlex.quote(chr(34) + 'maybe' + chr(34))} --environment main")
    options = main_options(story)
    expect_value((options.auto, options.merger, options.workflow, len(options.problems)), (False, True, "custom", 1))
    story.expect_success(f"setting set {AUTO} on --environment main", actor=story.user)
    expect_value((main_options(story).workflow, main_options(story).problems), ("builder", ()))
