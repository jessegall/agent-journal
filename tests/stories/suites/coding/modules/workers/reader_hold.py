from datetime import timedelta
import pytest
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import ended_run

from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.run_slots import RunSlots
from core.base.command.context import Context
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from tests.stories.core.modules.processes.support.reader_hold_fixtures import ForcedReaders, ReaderSampleKept, reader_worker, worker_run
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


@pytest.fixture
def kept_reader_sample(new_story):
    story = new_story(fixture=ForcedReaders)
    ended_run(story, "custom-build run", "compile\n" * 8 + "done\n")
    return story


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
                                       (PartSpec(line, line.split()[0], category=CommandCategory.BUILD),)), worker, environment_id=1)
        story.container.get(OutputFolder).write_output(process.id, 1, "compile\n" * 10)
        bus.run(EndProcessPart(process.id, 1, 0), worker, environment_id=1)
        ended = bus.run(EndProcess(process.id, 0, 5000, 10), worker, environment_id=1)
        nudges = story.container.get(EndedOutputText).nudges(ended)
        story.expect_rows(len(nudges) == 1, nudges[0] == OUTPUT_ENDED.nudge(output=ended.id, result="finished"))
    story.hook("s-8", HookSamples.stop())
    blocks = story.container.get(Queries).query(AgentBlock).filter(agent_id=worker.id, closed_at=None).all_rows()
    story.expect_rows(not tuple(blocks))


def test_a_worker_with_no_reader_is_held_and_cannot_skip_the_block(new_story):
    story = new_story(fixture=ForcedReaders)
    worker_run(story)
    worker = reader_worker(story)
    requests = story.container.get(ReaderRequestQuery)
    story.expect_rows(requests.holds(worker.id, story.clock.timestamp()))
    blocks = tuple(story.container.get(Queries).query(AgentBlock).filter(agent_id=worker.id).all_rows())
    story.expect_rows(len(blocks) == 1, blocks[0].grace_tool_uses == 0, blocks[0].grace_seconds == 0)
    story.expect_hook_refusal("s-reader", HookSamples.shell("touch skip", ShellPart("touch", CommandCategory.EDIT, ["skip"])), "no proper reader")


def test_a_held_worker_may_read_and_may_stop(new_story):
    story = new_story(fixture=ForcedReaders)
    worker_run(story, "stop-build run")
    story.expect_hook_allowed("s-reader", HookSamples.shell("cat README.md", ShellPart("cat", CommandCategory.READ, ["README.md"])))
    story.expect_hook_allowed("s-reader", HookSamples.stop())


def test_a_run_waits_in_the_queue_while_a_kept_sample_exists(kept_reader_sample):
    story = kept_reader_sample
    process = worker_run(story)
    story.expect_rows(not story.container.get(OutputFolder).has_slot(process.id))
    story.expect_rows(story.container.get(Queries).query(type(process)).find(process.id).is_queued)


def test_a_run_with_no_sample_runs_as_the_sample_while_its_worker_is_held(new_story):
    story = new_story(fixture=ForcedReaders)
    process = worker_run(story, "sample-build run")
    request = story.container.get(ReaderRequestQuery).open().page(1, 1).rows[0]
    story.expect_rows(request.sample_process_id == process.id, story.container.get(OutputFolder).has_slot(process.id))


def test_a_saved_proper_reader_frees_the_worker_and_starts_its_run_with_that_reader(kept_reader_sample):
    story = kept_reader_sample
    process = worker_run(story)
    reader = story.new_row_id('reader add proper --commands "custom-build*" --title Building --lines "done" --summary "done"', actor=story.agent)
    story.expect_rows(not story.container.get(ReaderRequestQuery).holds(reader_worker(story).id, story.clock.timestamp()))
    output = story.container.get(OutputQuery).process(process.id).page(1, 1).rows[0]
    story.expect_rows(output.reader_id == reader, output.read_offset == 0, story.container.get(OutputFolder).has_slot(process.id))


def test_a_reader_that_does_not_read_the_command_leaves_the_request_open(new_story):
    story = new_story(fixture=ForcedReaders)
    worker_run(story, "unmatched-build run")
    story.run('reader add unrelated --commands "another-build*" --title Building --lines done --summary done', actor=story.agent)
    story.expect_rows(story.container.get(ReaderRequestQuery).open().count() == 1)


def test_the_hold_runs_out_and_the_run_starts_with_no_reader(kept_reader_sample):
    story = kept_reader_sample
    process = worker_run(story)
    story.advance(timedelta(minutes=26))
    story.container.get(Bus).run(GrantRunSlots(), story.agent, environment_id=1)
    story.expect_rows(story.container.get(OutputFolder).has_slot(process.id))
    story.expect_rows(not story.container.get(ReaderRequestQuery).holds(reader_worker(story).id, story.clock.timestamp()))


def test_readers_forced_off_creates_no_request_block_or_wait(new_story):
    story = new_story(fixture=ForcedReaders)
    story.run("setting set journal.core.processes.readers-forced off --environment main", actor=story.agent)
    process = worker_run(story)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().exists(), story.container.get(OutputFolder).has_slot(process.id))
    story.expect_rows(not story.container.get(Queries).query(AgentBlock).filter(agent_id=reader_worker(story).id).exists())
