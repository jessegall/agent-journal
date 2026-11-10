from datetime import timedelta

from engine.enums.command_category import CommandCategory
from core.modules.docking.ticks.dock_item_leaves import DockItemLeaves
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, started_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

MOST_OUTPUTS = 6


def test_a_seventh_running_output_is_left_out_quietly_and_docks_once_a_place_frees(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    runs = [started_run(story, f"make build {number}", category=CommandCategory.BUILD) for number in range(MOST_OUTPUTS + 1)]
    story.advance(timedelta(seconds=6))
    story.hook("s-1", HookSamples.stop())
    story.run_listeners()
    for _ in range(3):
        story.expect_hook_allowed("s-1", HookSamples.stop())
        story.run_listeners()
    docked = story.run("dock-item list --oldest --json", actor=story.agent).output_text
    story.expect_rows(docked.count('"processes.output"') == MOST_OUTPUTS, detail=docked)
    story.expect_absent("agent-line list --agent 1", "could not run AddDockItem")
    end_run(story, runs[0], "done\n")
    story.advance(timedelta(seconds=11))
    story.run_listeners()
    DockItemLeaves()(story.container)
    story.hook("s-1", HookSamples.stop())
    story.run_listeners()
    docked = story.run("dock-item list --oldest --json", actor=story.agent).output_text
    story.expect_rows(f'"target_id": {runs[-1].id}' in docked, detail=docked)
