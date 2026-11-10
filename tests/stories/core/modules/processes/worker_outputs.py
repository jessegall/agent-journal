from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.driver.command_category import CommandCategory
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from tests.stories.core.modules.processes.support.process_samples import ended_run
from tests.stories.core.support.coding_fixtures import BuilderStarted


def worker_run(story, worker: Actor, line: str) -> int:
    process = story.container.get(Bus).run(StartProcess(worker.id, None, line, "/work/main", "zsh", CommandCategory.UNKNOWN, 30, [PartSpec(line, line.split()[0])]), worker, environment_id=1)
    return process.id


def test_a_worker_reads_and_lists_only_its_own_outputs(new_story):
    story = new_story(fixture=BuilderStarted)
    main_run = ended_run(story, "pytest -q", "ok\n")
    worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    agent_row = worker_run(story, worker, "make build")
    story.expect_refusal(f"output read {main_run.id} --all", "is not yours", actor=worker)
    story.expect_text(f"output status {agent_row}", f"{agent_row}  running", actor=worker)
    story.expect_refusal(f"output status {main_run.id}", "is not yours", actor=worker)
    story.expect_success(f"output status", f"{agent_row}  running", actor=worker)
    story.expect_text("output status", f"{main_run.id}  finished", actor=story.agent)
