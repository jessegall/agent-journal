from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder

WORKER_DISPATCH = HookSamples.shell("journal worker dispatch --model sonnet 1", ShellPart("journal", "journal", ["worker", "dispatch", "1", "--model", "sonnet"]))


def test_a_builder_whose_setting_keeps_it_solo_is_refused_a_dispatch(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.expect_success("setting make journal.suites.coding.workers.main-dispatches-workers false", "key: journal.suites.coding.workers.main-dispatches-workers")
    story.expect_hook_refusal("s-1", WORKER_DISPATCH, "the main agent sends no workers here")
