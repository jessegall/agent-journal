from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderStarted

MARKS = "chat-mark list --environment 1 --oldest"


def worker_run(story, worker: Actor, line: str, category: CommandCategory) -> int:
    command = StartProcess(worker.id, None, line, "/work/main", "zsh", category, 30, [PartSpec(line, line.split()[0], False, category)])
    process = story.container.get(Bus).run(command, worker, environment_id=1)
    story.container.get(Bus).run(MoveProcess(process.id), worker, environment_id=1)
    return process.id


def new_worker(story) -> Actor:
    return Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)


def test_a_workers_normal_command_makes_no_chat_mark_and_no_docked_card(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = worker_run(story, new_worker(story), "make build", CommandCategory.BUILD)
    story.run_listeners()
    story.expect_absent(MARKS, f"process:{process}")
    story.expect_absent("dock-item list", "processes.output")


def test_a_workers_test_run_makes_a_chat_mark_and_a_docked_card(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = worker_run(story, new_worker(story), "make test", CommandCategory.TEST_RUN)
    story.run_listeners()
    story.expect_text(MARKS, f"process:{process}")
    story.expect_text("dock-item list", "processes.output")
