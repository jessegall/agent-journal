from core.base.driver.command_category import CommandCategory
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process, tick
from tests.stories.core.support.coding_fixtures import BuilderStarted

AFTER = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])).with_fields(event="post_tool_use")
READER = 'reader add watched --commands "make*" --lines "FAILED|error"'


def watched(story) -> int:
    story.run(READER, actor=story.agent)
    process = start_process(story, "make test")
    story.run(f"output watch {process.id}", actor=story.agent)
    return process.id


def test_a_watch_tells_the_progress_only_as_it_passes_each_10_percent(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add steps --commands "make*" --lines "FAILED" --progress "\\[ *([0-9]+)%\\]"', actor=story.agent)
    process_id = start_process(story, "make test").id
    story.run(f"output watch {process_id}", actor=story.agent)
    folder = story.container.get(OutputFolder)
    folder.write_output(process_id, 1, "[ 42%]\nFAILED a\n")
    tick(story)
    assert f"output {process_id}: 42%" in story.hook("s-1", AFTER).lines
    folder.write_output(process_id, 1, "[ 42%]\nFAILED a\n[ 47%]\n")
    tick(story)
    assert not any("output" in line for line in story.hook("s-1", AFTER).lines)
    folder.write_output(process_id, 1, "[ 42%]\nFAILED a\n[ 47%]\n[ 53%]\n")
    tick(story)
    assert f"output {process_id}: 53%" in story.hook("s-1", AFTER).lines


def test_a_watch_of_an_ended_process_is_refused_and_a_watch_ends_with_its_process(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process_id = watched(story)
    end_run(story, start_process(story, "make other"), "done\n")
    story.expect_refusal("output watch 2", "has ended", actor=story.agent)
    story.run("output stop 1", actor=story.agent)
    story.expect_success("watch show 1", "state: ended", f"process_id: {process_id}", actor=story.agent)


def test_a_watch_is_ended_by_unwatching(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process_id = watched(story)
    story.run(f"output unwatch {process_id}", actor=story.agent)
    story.expect_success("watch show 1", "state: ended", actor=story.agent)
    story.expect_refusal(f"output unwatch {process_id}", "no open watch", actor=story.agent)
