from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.support.ended_output_text import EndedOutputText
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import OUTPUT_ENDED
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_worker_may_not_add_remove_or_choose_a_reader_even_with_skip_guard(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add owned --commands "custom-build*" --lines "done"', actor=story.agent)
    worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    for line in ('reader add blocked --commands "custom-build*" --lines "done"', 'reader remove owned', 'reader default owned'):
        story.expect_refusal(line + " --skip-guard processes.reader-owner", "a worker writes no readers: the main agent does", actor=worker)
    story.expect_text("reader list", "owned", actor=story.agent)
    story.expect_absent("reader list", "blocked", actor=story.agent)


def test_a_main_agent_a_person_and_a_module_can_add_readers(new_story):
    story = new_story(fixture=BuilderStarted)
    person = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    module = story.container.get(ModuleActors).actor("journal.core.processes")
    for name, actor in (("main", story.agent), ("person", person), ("module", module)):
        story.expect_success(f'reader add {name} --commands "custom-{name}*" --lines "done"', f"name: {name}", actor=actor)


def test_a_worker_run_with_a_poor_reader_or_none_gets_only_the_ended_line(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add poor --commands "poor-build*" --lines "never printed" --summary "never printed"', actor=story.agent)
    worker = Actor(story.new_row_id("agent start s-8 claude worker --environment main"), ActorType.AGENT)
    bus = story.container.get(Bus)
    for line in ("poor-build run", "unread-build run"):
        process = bus.run(StartProcess(worker.id, None, line, "/work/main", "zsh", CommandCategory.BUILD, 30,
                                       [PartSpec(line, line.split()[0], category=CommandCategory.BUILD)]), worker, environment_id=1)
        story.container.get(OutputFolder).write_output(process.id, 1, "compile\n" * 10)
        bus.run(EndProcessPart(process.id, 1, 0), worker, environment_id=1)
        ended = bus.run(EndProcess(process.id, 0, 5000, 10), worker, environment_id=1)
        nudges = story.container.get(EndedOutputText).nudges(ended)
        story.expect_rows(len(nudges) == 1, nudges[0] == OUTPUT_ENDED.nudge(output=ended.id, result="finished"))
    story.hook("s-8", HookSamples.stop())
    blocks = story.container.get(Queries).query(AgentBlock).filter(agent_id=worker.id, closed_at=None).all_rows()
    story.expect_rows(not tuple(blocks))
