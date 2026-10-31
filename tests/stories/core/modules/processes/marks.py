from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.docking.commands.keep_dock_item import KeepDockItem
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.chat.support.mark_samples import mark_count
from core.modules.processes.commands.move_process import MoveProcess
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process, tick
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted

MARKS = "chat-mark list --environment 1 --oldest"
AFTER = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])).with_fields(event="post_tool_use")
PROGRESS = 'reader add steps --commands "make*" --lines "FAILED" --progress "\\[ *([0-9]+)%\\]"'


def test_a_run_shows_a_process_mark_keyed_by_its_number(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    start_process(story, "make test")
    story.run_listeners()
    story.expect_text(MARKS, "processes.command", "process:1", "make test")


def test_the_readers_progress_is_the_marks_figure_updated_in_place(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run(PROGRESS, actor=story.agent)
    process = start_process(story, "make test")
    story.run_listeners()
    starting_count = mark_count(story)
    story.container.get(OutputFolder).write_output(process.id, 1, "building\n[ 40%]\n")
    tick(story)
    story.run_listeners()
    assert mark_count(story) == starting_count
    story.expect_text(MARKS, "40%")
    story.container.get(OutputFolder).write_output(process.id, 1, "building\n[ 40%]\n[ 80%]\n")
    tick(story)
    story.run_listeners()
    assert mark_count(story) == starting_count
    story.expect_text(MARKS, "80%")


def test_the_end_of_a_run_ends_its_mark_with_the_outcome_by_its_exit_code(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    passing, failing = start_process(story, "make one"), start_process(story, "make two")
    end_run(story, passing, "ok\n")
    end_run(story, failing, "boom\n", exit_code=2)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --outcome passed", "process:1")
    story.expect_text("chat-mark list --environment 1 --outcome failed", "process:2")
    story.expect_text("chat-mark list --environment 1 --state ended", "process:1", "process:2")


def test_a_run_moved_to_the_background_updates_its_mark_in_place(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "make build")
    story.run_listeners()
    starting_count = mark_count(story)
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    story.run_listeners()
    assert mark_count(story) == starting_count
    story.expect_text(MARKS, "process:1", "background")


def test_the_mark_is_a_process_mark_that_opens_the_output_and_has_a_stop_and_a_dock_button(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "processes.command")
    assert (mark.family, mark.family_title, mark.group, mark.click, mark.process) == ("processes.commands", "Commands", "work", "open row", True)
    assert [(button["label"], button["runs"]) for button in mark.buttons] == [("Stop", "output stop {row_id}"), ("Dock", "dock add processes.output process {row_id}")]


def test_a_watch_docks_the_output_and_it_leaves_10_seconds_after_its_process_ends_unless_kept(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    kept, leaving = start_process(story, "make kept"), start_process(story, "make leaving")
    story.run(f"output watch {kept.id}", actor=story.agent)
    story.run(f"output watch {leaving.id}", actor=story.agent)
    story.run_listeners()
    story.expect_text("dock-item list --oldest", "processes.output")
    story.container.get(Bus).run(KeepDockItem(1), user)
    end_run(story, kept, "a\n")
    end_run(story, leaving, "b\n")
    story.advance(timedelta(seconds=11))
    story.run('task make "Tick" --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_text("dock-item show 1", "state: docked")
    story.expect_text("dock-item show 2", "state: undocked")
