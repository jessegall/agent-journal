from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import parts_started, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

MARKS = "chat-mark list --environment 1 --oldest"
HIDDEN = [("cat notes", CommandCategory.READ), ("grep -n word notes", CommandCategory.SEARCH), ("sed -i s/a/b/ notes", CommandCategory.EDIT), ("cat > notes", CommandCategory.EDIT), ("./deploy.sh", CommandCategory.UNKNOWN)]


def worker_run(story, worker: Actor, line: str, category: CommandCategory) -> int:
    command = StartProcess(worker.id, None, line, "/work/main", "zsh", category, 30, [PartSpec(line, line.split()[0], False, category)])
    process = story.container.get(Bus).run(command, worker, environment_id=1)
    parts_started(story, process)
    story.container.get(Bus).run(MoveProcess(process.id), worker, environment_id=1)
    story.run(f"output watch {process.id}", actor=worker)
    return process.id


def new_worker(story) -> Actor:
    return Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)


def test_a_command_that_is_no_test_run_or_build_makes_no_chat_mark_and_no_docked_card_for_any_agent_also_past_the_seconds_that_dock_a_run(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    worker = new_worker(story)
    for line, category in HIDDEN:
        main_run = moved_run(story, line, category=category)
        story.run(f"output watch {main_run.id}", actor=story.agent)
        worker_run(story, worker, line, category)
    story.advance(timedelta(seconds=6))
    story.hook("s-1", HookSamples.stop())
    story.run_listeners()
    story.expect_absent(MARKS, "process:")
    story.expect_absent("dock-item list", "processes.output")


def test_a_test_run_and_a_build_make_a_chat_mark_and_a_docked_card_for_the_main_agent_and_for_a_worker(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    worker = new_worker(story)
    story.run("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main")
    for line, category in [("make test", CommandCategory.TEST_RUN), ("make build", CommandCategory.BUILD)]:
        worker_run(story, worker, line, category)
        main_run = moved_run(story, line, category=category)
        story.run(f"output watch {main_run.id}", actor=story.agent)
    story.advance(timedelta(seconds=6))
    story.tick("s-1")
    story.tick("s-9")
    story.run_listeners()
    for process in range(1, 5):
        story.expect_text(MARKS, f"process:{process}")
    story.expect_text("dock-item show 4", "type: processes.output")
