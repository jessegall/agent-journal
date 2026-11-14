import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from engine.enums.command_category import CommandCategory
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.output_folder import OutputFolder
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from core.modules.processes.models.enums.process_setting import ProcessSetting

TEST_ROWS_REASON = "the test reads every row it checks"


@pytest.fixture
def worker_reader_sample(new_story):
    story = new_story(fixture=ForcedReaders)
    install_runner(story)
    process = worker_run(story)
    end_run(story, process, "compiling\n" * 12 + "done\n")
    return story


@pytest.fixture
def exhausted_worker_reader(worker_reader_sample):
    story = worker_reader_sample
    for _ in range(3):
        story.expect_refusal('reader add broken --commands "custom-build*" --title Building --lines missing --summary missing',
                             "missed", actor=reader_worker(story))
    return story


def test_a_worker_saves_a_reader_with_the_same_output_proof(worker_reader_sample):
    story = worker_reader_sample
    story.expect_success('reader add own-build --commands "custom-build*" --title "Custom tests" --lines done --summary done --step PASSED --count "collected ([0-9]+)" --count-command "{part} --list"',
                         "name: own-build", actor=reader_worker(story))
    reader = story.container.get(Queries).query(Reader).filter(name="own-build").page(1, 1).rows[0]
    story.expect_rows(reader.proved_on == 1, not story.container.get(ReaderRequestQuery).open().exists())


def test_a_worker_gets_its_reader_request_before_the_main_agent(worker_reader_sample):
    story = worker_reader_sample
    story.expect_hook_allowed("s-reader", HookSamples.prompt("continue"), "Reader request 1: agent")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("continue"), "reader request")
    story.tick("s-1")
    story.expect_rows(not story.container.get(Queries).query(AgentLine).filter(source="processes.reader-request.1").exists())


def test_a_different_worker_cannot_save_the_request_draft(worker_reader_sample):
    story = worker_reader_sample
    worker = Actor(story.new_row_id("agent start s-other claude worker --environment main"), ActorType.AGENT)
    story.expect_refusal("reader draft 1 --save", "own open reader request", actor=worker)


def test_failed_saves_leave_no_reader_or_output_proof(worker_reader_sample):
    story = worker_reader_sample
    story.expect_refusal('reader add broken --commands "custom-build*" --title Building --lines missing --summary missing',
                         "missed", actor=reader_worker(story))
    story.expect_rows(not story.container.get(Queries).query(Reader).filter(name="broken").exists(),
                      story.container.get(ReaderRequestQuery).open().exists())
    story.expect_success('reader add repaired --commands "custom-build*" --title "Custom tests" --lines done --summary done --step PASSED --count "collected ([0-9]+)" --count-command "{part} --list"',
                         "name: repaired", actor=reader_worker(story))


def test_the_worker_stops_saving_after_three_failures(exhausted_worker_reader):
    story = exhausted_worker_reader
    story.expect_refusal('reader add fourth --commands "custom-build*" --title "Custom tests" --lines done --summary done --step PASSED --count "collected ([0-9]+)" --count-command "{part} --list" --skip-guard processes.reader-owner',
                         "has no skip", actor=reader_worker(story))
    story.expect_refusal("reader draft 1 --save", "main agent", actor=reader_worker(story))
    story.expect_rows(not story.container.get(Queries).query(Reader).filter(name="fourth").exists())
    story.expect_hook_allowed("s-1", HookSamples.prompt("help"), "Reader request 1")


def test_an_idle_main_agent_is_asked_to_help_after_failed_saves(exhausted_worker_reader):
    story = exhausted_worker_reader
    story.tick("s-1")
    lines = tuple(story.container.get(Queries).query(AgentLine).filter(source="processes.reader-request.1").every_row(TEST_ROWS_REASON))
    story.expect_rows(len(lines) == 1, lines[0].wakes_agent, "Reader request 1" in lines[0].text)


def test_the_failed_save_limit_can_be_configured(worker_reader_sample):
    story = worker_reader_sample
    story.expect_success(f"setting set {ProcessSetting.READER_SAVE_TRIES.key} 1 --environment main")
    story.expect_refusal('reader add broken --commands "custom-build*" --lines "["', "does not compile", actor=reader_worker(story))
    story.expect_refusal("reader draft 1 --save", "main agent", actor=reader_worker(story))
    story.expect_hook_allowed("s-1", HookSamples.prompt("help"), "Reader request 1")


def test_incomplete_draft_saves_count_toward_the_same_limit(worker_reader_sample):
    story = worker_reader_sample
    story.run(f"setting set {ProcessSetting.READER_SAVE_TRIES.key} 1 --environment main")
    process = worker_run(story, "custom-test run", CommandCategory.TEST_RUN)
    end_run(story, process, "building\ncompiling\nwaiting\nworking\n")
    story.expect_refusal("reader draft 2 --save", "could not fill", actor=reader_worker(story))
    story.expect_refusal('reader add repaired --commands "custom-test*" --title "Project tests" --lines done --summary done',
                         "main agent", actor=reader_worker(story))


def test_an_exhausted_request_does_not_use_another_requests_tries(exhausted_worker_reader):
    story = exhausted_worker_reader
    process = worker_run(story, "another-build run")
    end_run(story, process, "compiling\n" * 12 + "done\n")
    story.expect_success('reader add another --commands "another-build*" --title "Custom tests" --lines done --summary done --step PASSED --count "collected ([0-9]+)" --count-command "{part} --list"',
                         "name: another", actor=reader_worker(story))
    story.expect_rows(story.container.get(ReaderRequestQuery).find(1).completed_at is None,
                      story.container.get(ReaderRequestQuery).find(2).completed_at is not None)


def test_a_worker_test_reader_requires_count_and_progress(worker_reader_sample):
    story = worker_reader_sample
    process = worker_run(story, "custom-test run", CommandCategory.TEST_RUN)
    end_run(story, process, "collected 3 items\n" + "test preparing\n" * 12 + "3 passed [100%]\n")
    story.expect_refusal('reader add tests --commands "custom-test*" --title "Project tests" --lines passed --summary passed',
                         "--count", actor=reader_worker(story))
    story.expect_text("reader draft 2 --save", "saved reader pytest", actor=reader_worker(story))
    reader = story.container.get(Queries).query(Reader).filter(name="pytest").page(1, 1).rows[0]
    story.expect_rows(reader.proved_on == process.id, story.container.get(ReaderRequestQuery).find(2).completed_at is not None)
