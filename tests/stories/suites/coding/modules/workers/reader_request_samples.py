import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.support.process_samples import end_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run


@pytest.fixture
def reader_sample_story(new_story):
    return new_story(fixture=ForcedReaders)


@pytest.fixture
def reader_scoped_story(reader_sample_story):
    story = reader_sample_story
    process = worker_run(story)
    end_run(story, process, "compiling\n" * 8 + "done\n")
    return story


def test_each_worker_gets_its_own_request_and_sample(reader_scoped_story):
    story = reader_scoped_story
    second = Actor(story.new_row_id("agent start s-second claude worker --environment main"), ActorType.AGENT)
    process = story.container.get(Bus).run(StartProcess.single_part(second.id, "custom-build run", "/work/main", CommandCategory.TEST_RUN, 30), second, environment_id=1)
    requests = tuple(story.container.get(ReaderRequestQuery).open().agent(second.id).all_rows())
    story.expect_rows(len(requests) == 1, requests[0].creator_id == second.id,
                      requests[0].sample_process_id == process.id,
                      story.container.get(OutputFolder).has_slot(process.id))


def test_another_command_of_the_same_program_has_its_own_sample(reader_scoped_story):
    story = reader_scoped_story
    process = worker_run(story, "custom-build other")
    requests = tuple(story.container.get(ReaderRequestQuery).open().all_rows())
    story.expect_rows(len(requests) == 2, any(request.sample_process_id == process.id for request in requests),
                      story.container.get(OutputFolder).has_slot(process.id))


def test_a_worker_saves_against_its_sample_and_leaves_a_foreign_request_open(reader_scoped_story):
    story = reader_scoped_story
    second = Actor(story.new_row_id("agent start s-other claude worker --environment main"), ActorType.AGENT)
    process = story.container.get(Bus).run(StartProcess.single_part(second.id, "custom-build run", "/work/main", CommandCategory.TEST_RUN, 30), second, environment_id=1)
    end_run(story, process, "compiling\n" * 8 + "finished elsewhere\n")
    story.expect_success('reader add local-build --commands "custom-build*" --title "Custom tests" --lines done --summary done --step PASSED --count "collected ([0-9]+)" --count-command "{part} --list"', actor=reader_worker(story))
    requests = story.container.get(ReaderRequestQuery)
    story.expect_rows(not requests.has_active_requests(reader_worker(story).id, story.clock.timestamp()),
                      requests.has_active_requests(second.id, story.clock.timestamp()))


def test_a_rejected_command_ends_its_request_without_a_reader(reader_sample_story):
    story = reader_sample_story
    process = worker_run(story, "journal sins --tail", CommandCategory.TEST_RUN)
    end_run(story, process, "Usage: journal sins [OPTIONS]\nUnknown option --tail\n", exit_code=2)
    requests = story.container.get(ReaderRequestQuery)
    story.expect_rows(not requests.has_active_requests(reader_worker(story).id, story.clock.timestamp()))
    retry = worker_run(story, "journal sins --tail", CommandCategory.TEST_RUN)
    request = requests.open().page(1, 1).rows[0]
    story.expect_rows(request.sample_process_id == retry.id, story.container.get(OutputFolder).has_slot(retry.id))


def test_nothing_to_judge_does_not_make_a_good_reader_poor(reader_sample_story):
    story = reader_sample_story
    story.run('reader add checks --commands "custom-check*" --title Checking --lines "findings|clean" --summary "findings|clean"')
    process = worker_run(story, "custom-check run", CommandCategory.CHECK)
    story.container.get(Bus).run(MoveProcess(process.id), reader_worker(story), environment_id=1)
    end_run(story, process, "Nothing to judge\n")
    worker_run(story, "custom-check run", CommandCategory.CHECK)
    story.expect_rows(not story.container.get(ReaderRequestQuery).open().exists())
