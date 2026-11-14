from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder
from suites.coding.modules.workers.support.worker_settings import DISPATCHES_WORKERS_SETTING

WORKER_DISPATCH = HookSamples.shell("journal worker dispatch --model sonnet 1", ShellPart("journal", "journal", ["worker", "dispatch", "1", "--model", "sonnet"]))


def test_a_builder_whose_setting_keeps_it_solo_is_refused_a_dispatch(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.expect_success(f"setting make {DISPATCHES_WORKERS_SETTING} false", f"key: {DISPATCHES_WORKERS_SETTING}")
    story.expect_hook_refusal("s-1", WORKER_DISPATCH, "The main agent sends no workers here")
