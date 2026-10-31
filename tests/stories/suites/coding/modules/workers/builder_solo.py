from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask

WORKER_DISPATCH = HookSamples.shell("journal worker dispatch 1", ShellPart("journal", "journal", ["worker", "dispatch", "1"]))


def test_a_builder_whose_setting_keeps_it_solo_is_refused_a_dispatch(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success("setting make journal.suites.coding.workers.builder-dispatches-workers false", "key: journal.suites.coding.workers.builder-dispatches-workers")
    story.expect_hook_refusal("s-1", WORKER_DISPATCH, "this builder builds its tasks itself")
