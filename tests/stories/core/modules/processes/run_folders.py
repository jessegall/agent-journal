from datetime import timedelta

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.prune_run_folders.prune_run_folders import PruneRunFolders
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted

LONG_OUTPUT = "a line\n" * 400


def test_a_short_run_loses_its_folder_once_it_ended_a_while_ago_and_a_kept_output_keeps_its_own(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    folder = story.container.get(OutputFolder)
    bus = story.container.get(Bus)
    short = start_process(story, "git status", category=CommandCategory.READ)
    folder.write(short.id, "1.out", "clean\n")
    kept = moved_run(story, "make test", category=CommandCategory.TEST_RUN)
    end_run(story, kept, LONG_OUTPUT)
    running = moved_run(story, "make build", category=CommandCategory.BUILD)
    folder.write(running.id, "1.out", "building\n")
    bus.run(EndProcess(short.id, 0, 6, 1), story.agent, environment_id=1)
    assert bus.run(PruneRunFolders(), Actor.core(), environment_id=1) == 0
    assert folder.process_ids() == [short.id, kept.id, running.id]
    story.advance(timedelta(minutes=11))
    assert bus.run(PruneRunFolders(), Actor.core(), environment_id=1) == 1
    assert folder.process_ids() == [kept.id, running.id]
