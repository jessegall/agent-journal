from datetime import timedelta
import pytest
from core.testing.shell_part import ShellPart
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.drivers.models.agent_line import AgentLine
from tests.stories.core.modules.processes.support.process_samples import end_run
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment

from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
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
from core.testing.expect_reply import expect_reply_line


@pytest.fixture
def kept_reader_sample(new_story):
    story = new_story(fixture=ForcedReaders)
    process = worker_run(story)
    end_run(story, process, "compile\n" * 8 + "done\n")
    return story


@pytest.fixture
def requested_reader_story(new_story):
    story = new_story(fixture=ForcedReaders)
    story.run("setting set journal.core.processes.reader-save-tries 0 --environment main")
    install_runner(story)
    worker_run(story)
    return story


@pytest.fixture
def notified_reader_story(requested_reader_story):
    requested_reader_story.hook("s-1", HookSamples.prompt("write the reader"))
    requested_reader_story.advance(timedelta(seconds=1))
    return requested_reader_story


def test_a_worker_may_not_add_remove_or_choose_a_reader_even_with_skip_guard(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add local --commands "custom-build*" --lines "done"', actor=story.agent)
    worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    for line in ('reader add blocked --commands "custom-build*" --lines "done"', 'reader remove local', 'reader default local'):
        story.expect_refusal(line + " --skip-guard processes.reader-owner", "has no skip", actor=worker)
    story.expect_text("reader list", "local", actor=story.agent)
    story.expect_absent("reader list", "blocked", actor=story.agent)


def test_a_main_agent_a_person_and_a_module_can_add_readers(new_story):
    story = new_story(fixture=BuilderStarted)
    person = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    module = story.container.get(ModuleActors).actor("journal.core.processes")
    for name, actor in (("main", story.agent), ("person", person), ("module", module)):
        story.expect_success(f'reader add {name} --commands "custom-{name}*" --lines "done"', f"name: {name}", actor=actor)


def test_a_worker_run_with_a_poor_reader_or_none_gets_only_the_ended_line(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run("setting set journal.core.processes.readers-forced off --environment main")
    story.run('reader add poor --commands "poor-build*" --lines "never printed" --summary "never printed"', actor=story.agent)
    worker = Actor(story.new_row_id("agent start s-8 claude worker --environment main"), ActorType.AGENT)
    bus = story.container.get(Bus)
    for line in ("poor-build run", "unread-build run"):
        process = bus.run(StartProcess(worker.id, None, line, "/work/main", "zsh", CommandCategory.BUILD, 30,
                                       [PartSpec(line, line.split()[0], category=CommandCategory.BUILD)]), worker, environment_id=1)
        story.container.get(OutputFolder).write_output(process.id, 1, "compile\n" * 10)
        bus.run(EndProcessPart(process.id, 1, 0), worker, environment_id=1)
        ended = bus.run(EndProcess(process.id, 0, 5000, 10), worker, environment_id=1)
        nudges = story.container.get(EndedOutputText).nudges(tuple([ended]))
        story.expect_rows(len(nudges) == 1, nudges[0] == OUTPUT_ENDED.nudge(output=ended.id, result="finished"))
    story.hook("s-8", HookSamples.stop())
    blocks = story.container.get(Queries).query(AgentBlock).filter(session_agent_id=worker.id, closed_at=None).all_rows()
    story.expect_rows(not tuple(blocks))


def test_a_worker_with_no_reader_is_held_and_cannot_skip_the_block(new_story):
    story = new_story(fixture=ForcedReaders)
    worker_run(story)
    worker = reader_worker(story)
    requests = story.container.get(ReaderRequestQuery)
    story.expect_rows(requests.has_active_requests(worker.id, story.clock.timestamp()))
    blocks = tuple(story.container.get(Queries).query(AgentBlock).filter(session_agent_id=worker.id).all_rows())
    story.expect_rows(len(blocks) == 1, blocks[0].grace_tool_uses == 0, blocks[0].grace_seconds == 0)
    story.expect_refusal(f'agent-block skip {blocks[0].id} --reason "skip the reader"', "cannot", actor=worker)
    story.expect_hook_refusal("s-reader", HookSamples.shell("touch skip", ShellPart("touch", CommandCategory.EDIT, ["skip"])), "no proper reader")


def test_a_held_worker_may_read_and_may_stop(new_story):
    story = new_story(fixture=ForcedReaders)
    worker_run(story, "stop-build run")
    install_runner(story)
    story.expect_hook_allowed("s-reader", HookSamples.shell("cat README.md", ShellPart("cat", CommandCategory.READ, ["README.md"])))
    story.expect_hook_allowed("s-reader", HookSamples.stop())


def test_a_run_waits_in_the_queue_while_a_kept_sample_exists(kept_reader_sample):
    story = kept_reader_sample
    process = worker_run(story)
    story.expect_rows(not story.container.get(OutputFolder).has_slot(process.id))
    story.expect_rows(story.container.get(Queries).query(type(process)).find(process.id).queued_at is not None)


def test_a_run_with_no_sample_runs_as_the_sample_while_its_worker_is_held(new_story):
    story = new_story(fixture=ForcedReaders)
    process = worker_run(story, "sample-build run")
    request = story.container.get(ReaderRequestQuery).open().page(1, 1).rows[0]
    story.expect_rows(request.sample_process_id == process.id, story.container.get(OutputFolder).has_slot(process.id))


def test_a_saved_proper_reader_frees_the_worker_and_starts_its_run_with_that_reader(kept_reader_sample):
    story = kept_reader_sample
    process = worker_run(story)
    reader = story.new_row_id('reader add proper --commands "custom-build*" --title Building --lines "done" --summary "done"', actor=reader_worker(story))
    story.expect_rows(not story.container.get(ReaderRequestQuery).has_active_requests(reader_worker(story).id, story.clock.timestamp()))
    output = story.container.get(OutputQuery).process(process.id).page(1, 1).rows[0]
    story.expect_rows(output.reader_id == reader, output.read_offset == 0, story.container.get(OutputFolder).has_slot(process.id))
    story.expect_text(f"agent-line list --agent {reader_worker(story).id}", "read the sample of output 1 with reader proper")


def test_a_reader_that_does_not_read_the_command_leaves_the_request_open(new_story):
    story = new_story(fixture=ForcedReaders)
    worker_run(story, "unmatched-build run")
    story.expect_text('reader add unrelated --commands "another-build*" --title Building --lines done --summary done', "does not read unmatched-build run", actor=story.agent)
    story.expect_rows(story.container.get(ReaderRequestQuery).open().count() == 1)


def test_the_hold_runs_out_and_the_run_starts_with_no_reader(kept_reader_sample):
    story = kept_reader_sample
    process = worker_run(story)
    story.advance(timedelta(minutes=26))
    story.container.get(Bus).run(GrantRunSlots(), story.agent, environment_id=1)
    story.expect_rows(story.container.get(OutputFolder).has_slot(process.id))
    story.expect_rows(not story.container.get(ReaderRequestQuery).has_active_requests(reader_worker(story).id, story.clock.timestamp()))


def test_readers_forced_off_creates_no_request_block_or_wait(new_story):
    story = new_story(fixture=ForcedReaders)
    story.run("setting set journal.core.processes.readers-forced off --environment main")
    process = worker_run(story)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().exists(), story.container.get(OutputFolder).has_slot(process.id))
    story.expect_rows(not story.container.get(Queries).query(AgentBlock).filter(session_agent_id=reader_worker(story).id).exists())


def test_with_no_main_agent_the_worker_is_not_held_and_its_run_goes_on(new_story):
    story = new_story(fixture=ForcedReaders)
    story.run(f"agent end {story.agent.id}", actor=story.agent)
    process = worker_run(story, "alone-build run")
    request = story.container.get(ReaderRequestQuery).open().page(1, 1).rows[0]
    story.expect_rows(request.expires_at == story.clock.timestamp(), story.container.get(OutputFolder).has_slot(process.id))
    story.expect_rows(not story.container.get(Queries).query(AgentBlock).filter(session_agent_id=reader_worker(story).id).exists())


def test_a_stopped_worker_is_started_again_when_its_waiting_run_ends(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.run("setting set journal.core.processes.readers-forced on --environment main")
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1", actor=story.agent), ActorType.AGENT)
    bus = story.container.get(Bus)
    process = bus.run(StartProcess.single_part(worker.id, "stopped-build run", "/work", CommandCategory.BUILD, 30), worker, environment_id=1)
    story.run(f"process background {process.id}", actor=worker)
    story.run(f"agent end {worker.id}", actor=worker)
    story.run_listeners()
    bus.run(EndProcess(process.id, 0, 5000, 10), worker, environment_id=1)
    story.expect_text(f"agent-line list --agent {worker.id}", f"your run {process.id} ended", "workers.worker-job")


def test_a_running_sample_uses_the_saved_reader_from_the_start(new_story):
    story = new_story(fixture=ForcedReaders)
    process = worker_run(story, "running-build run")
    reader = story.new_row_id('reader add running --commands "running-build*" --title Building --lines done --summary done', actor=story.agent)
    output = story.container.get(OutputQuery).process(process.id).page(1, 1).rows[0]
    story.expect_rows(output.reader_id == reader, output.read_offset == 0, output.title == "Building")


def test_the_main_agent_gets_one_line_and_no_chat_mark_for_two_workers_on_one_command(requested_reader_story):
    story = requested_reader_story
    second = Actor(story.new_row_id("agent start s-second claude worker --environment main"), ActorType.AGENT)
    story.container.get(Bus).run(StartProcess.single_part(second.id, "custom-build another", "/work", CommandCategory.BUILD, 30), second, environment_id=1)
    reply = story.hook("s-1", HookSamples.prompt("continue"))
    story.expect_rows(sum("reader request" in line for line in reply.lines) == 2)
    story.run_listeners()
    marks = tuple(story.container.get(Queries).query(ChatMark).filter(key="reader-request:1").all_rows())
    story.expect_rows(not marks)
    repeated_reply = story.hook("s-1", HookSamples.prompt("continue again"))
    story.expect_rows(not any("reader request" in line for line in repeated_reply.lines))


def test_the_main_agent_is_held_after_five_tool_uses_with_a_countdown(notified_reader_story):
    story = notified_reader_story
    hooks = [story.hook("s-1", HookSamples.edit(f"src/cart{number}.py")) for number in range(5)]
    story.expect_rows(not any(reply.refusal for reply in hooks))
    story.expect_rows(any("due: 0 tool uses" in line for line in hooks[-1].lines))
    story.expect_hook_refusal("s-1", HookSamples.edit("src/blocked.py"), "reader request")


def test_a_skipped_block_does_not_free_the_worker_and_comes_back(notified_reader_story):
    story = notified_reader_story
    blocks = story.container.get(Queries).query(AgentBlock).filter(session_agent_id=story.agent.id, closed_at=None).all_rows()
    block = next(block for block in blocks if block.nudge_key.startswith("processes.reader_request"))
    story.run(f'agent-block skip {block.id} --reason "finish another change"', actor=story.agent)
    story.expect_rows(story.container.get(ReaderRequestQuery).has_active_requests(reader_worker(story).id, story.clock.timestamp()))
    story.advance(timedelta(minutes=11))
    reply = story.hook("s-1", HookSamples.prompt("continue"))
    expect_reply_line(reply, "reader request")
    story.expect_rows(story.container.get(Queries).query(AgentBlock).filter(session_agent_id=story.agent.id, closed_at=None).exists())


def test_with_no_main_agent_the_worker_is_not_held_and_the_next_main_agent_is_told(new_story):
    story = new_story(fixture=ForcedReaders)
    story.run("setting set journal.core.processes.reader-save-tries 0 --environment main")
    story.run(f"agent end {story.agent.id}", actor=story.agent)
    worker_run(story, "next-build run")
    story.expect_rows(not story.container.get(ReaderRequestQuery).has_active_requests(reader_worker(story).id, story.clock.timestamp()))
    reply = story.hook("s-next", HookSamples.session_start())
    story.expect_rows(any("reader request" in line for line in reply.lines))


def test_waive_frees_the_worker_and_starts_its_run_with_no_reader(kept_reader_sample):
    story = kept_reader_sample
    process = worker_run(story)
    story.expect_success('reader-request waive 1 --reason "read this build by hand"', actor=story.agent)
    request = story.container.get(ReaderRequestQuery).find(1)
    story.expect_rows(request.completed_at is not None, request.skip_reason == "read this build by hand")
    story.expect_rows(story.container.get(OutputFolder).has_slot(process.id))
    story.expect_rows(story.container.get(OutputQuery).process(process.id).page(1, 1).rows[0].reader_id is None)
    story.run_listeners()
    story.expect_rows(not story.container.get(Queries).query(ChatMark).filter(key="reader-request:1").exists())


def test_an_idle_main_agent_gets_the_reader_request_on_tick(requested_reader_story):
    story = requested_reader_story
    reply = story.tick("s-1")
    story.expect_rows(not reply.lines)
    lines = tuple(story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id, source="processes.reader-request.1").all_rows())
    story.expect_rows(len(lines) == 1, lines[0].wakes_agent, "reader request 1" in lines[0].text)
    story.tick("s-1")
    story.expect_rows(story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id, source="processes.reader-request.1").count() == 1)


def test_reader_sample_changes_make_no_chat_mark(requested_reader_story):
    story = requested_reader_story
    request = story.container.get(ReaderRequestQuery).find(1)
    story.container.get(OutputFolder).write_output(request.sample_process_id, 1, "first line\n" + "middle\n" * 30 + "last line\n")
    worker = reader_worker(story)
    story.container.get(Bus).run(EndProcess(request.sample_process_id, 0, 5000, 32), worker, environment_id=1)
    story.run_listeners()
    story.expect_rows(not story.container.get(Queries).query(ChatMark).filter(key="reader-request:1").exists())


@pytest.mark.parametrize("text", [
    "bringing up nodes...\n\n\n0 stories used a real Claude Code or Codex\nno tests ran in 1.52s\n" * 4,
    "================ test session starts ================\ncollected 0 items\n\n================ no tests ran in 0.02s ================\n",
])
def test_a_run_with_no_test_results_does_not_fail_the_reader_or_hold_the_next_worker_run(new_story, text):
    story = new_story(fixture=ForcedReaders)
    install_runner(story)
    story.run("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main")
    process = worker_run(story, "python3 -m pytest tests/empty.py", CommandCategory.TEST_RUN)
    end_run(story, process, text, exit_code=5)
    following = worker_run(story, "python3 -m pytest tests/next.py", CommandCategory.TEST_RUN)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().exists())
    story.expect_rows(story.container.get(OutputFolder).has_slot(following.id))
    story.expect_rows(not story.container.get(ReaderRequestQuery).has_active_requests(reader_worker(story).id, story.clock.timestamp()))


def test_a_reader_that_stops_matching_on_a_worker_run_asks_the_main_agent_and_holds_the_next_run(new_story):
    story = new_story(fixture=ForcedReaders)
    story.run('reader add changing --commands "changing-build*" --title Building --lines done --summary done', actor=story.agent)
    first = worker_run(story, "changing-build first")
    end_run(story, first, "done\n")
    second = worker_run(story, "changing-build second")
    end_run(story, second, "new output\n" * 8)
    request = story.container.get(ReaderRequestQuery).open().page(1, 1).rows[0]
    story.expect_rows("changing" in request.reason, request.sample_process_id == second.id)
    story.expect_rows(story.container.get(ReaderRequestQuery).has_active_requests(reader_worker(story).id, story.clock.timestamp()))
    following = worker_run(story, "changing-build second")
    story.expect_rows(not story.container.get(OutputFolder).has_slot(following.id))
    story.expect_rows(story.container.get(ReaderRequestQuery).has_active_requests(reader_worker(story).id, story.clock.timestamp()))
