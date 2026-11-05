from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reader_demands import ReaderDemands
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.support.process_samples import end_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run


def test_a_test_reader_is_not_judged_on_a_python_setup_command(new_story):
    story = new_story(fixture=ForcedReaders)
    story.expect_success('reader add python3 --commands "python3*" --title "Python tests" --lines "passed" --summary "([0-9]+ passed)" --count "collected ([0-9]+)" --step "^test_"', actor=story.agent)
    worker = reader_worker(story)
    parts = [PartSpec('python3 -c "update_sources()"', "python3", category=CommandCategory.EDIT),
             PartSpec("python3 -m pytest tests/cart -q", "python3", category=CommandCategory.TEST_RUN)]
    bus = story.container.get(Bus)
    process = bus.run(StartProcess(worker.id, None, " && ".join(part.text for part in parts), "/work", "zsh", CommandCategory.TEST_RUN, 30, parts), worker, environment_id=1)
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, "updated source\n" * 6)
    folder.write_output(process.id, 2, "collected 73\n73 passed in 9.84s\n")
    for position in (1, 2):
        bus.run(EndProcessPart(process.id, position, 0), worker, environment_id=1)
    bus.run(EndProcess(process.id, 0, 5000, 8), worker, environment_id=1)
    story.run_listeners()
    story.expect_text(f"output read {process.id} --summary", "73 passed", actor=worker)
    reader = story.container.get(ReaderQuery).with_name("python3").page(1, 1).rows[0]
    expect_reason_2(story, parts, reader, worker.id, "")
    bus.run(StartProcess.single_part(worker.id, parts[1].text, "/work", CommandCategory.TEST_RUN, 30), worker, environment_id=1)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().exists())


def test_only_the_owner_is_told_to_read_a_shared_sample(new_story):
    story = new_story(fixture=ForcedReaders)
    sample = worker_run(story)
    second = Actor(story.new_row_id("agent start s-second claude worker --environment main"), ActorType.AGENT)
    story.container.get(Bus).run(StartProcess.single_part(second.id, "custom-build another", "/work", CommandCategory.BUILD, 30), second, environment_id=1)
    expect_count_open(story, 2)
    end_run(story, sample, "compile\n" * 8 + "done\n")
    story.expect_success('reader add custom --commands "custom-build*" --title Building --lines done --summary done', actor=story.agent)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {sample.session_agent_id}", f"journal output read {sample.id} --reader custom")
    story.expect_no_text(f"agent-line list --agent {second.id}", f"journal output read {sample.id}")


def test_a_shell_limit_before_pytest_needs_no_reader_of_its_own(new_story):
    story = new_story(fixture=ForcedReaders)
    worker = reader_worker(story)
    parts = [PartSpec("ulimit -n 8192", "ulimit", category=CommandCategory.READ),
             PartSpec("python3 -m pytest tests/cart -q", "python3", category=CommandCategory.TEST_RUN)]
    story.container.get(Bus).run(StartProcess(worker.id, None, " && ".join(part.text for part in parts), "/work", "zsh", CommandCategory.TEST_RUN, 30, parts), worker, environment_id=1)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().exists())


def expect_count_open(story, expected) -> None:
    actual = story.container.get(ReaderRequestQuery).open().count()
    assert actual == expected, actual


def expect_reason_2(story, parts, reader, agent_id, expected) -> None:
    actual = story.container.get(ReaderDemands).reason(parts[1], reader, ReaderSampleScope(agent_id, parts[1].text))
    assert actual == expected, actual
