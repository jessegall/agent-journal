
from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader_request import ReaderRequest
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import worker_run
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.modules.processes.models.enums.process_setting import ProcessSetting

TEST_ROWS_REASON = "the test reads every row it checks"


READS_BESIDE_THE_PRUNING = 1


class ProcessLog(StoryFixture):
    """The process log keeps two ended runs beside its running commands."""

    parent = UserBuilder

    def steps(self, story):
        story.run(f"setting set {ProcessSetting.PROCESSES_KEPT.key} 2 --environment main", actor=story.user)


def test_a_reader_request_loses_its_sample_when_the_sample_is_removed(new_story):
    story = new_story(fixture=ProcessLog)
    story.run("agent start s-reader claude worker --environment main")
    sample = worker_run(story, "custom-build sample")
    end_run(story, sample, "sample\n")
    ended_run(story, "make second", "second\n")
    ended_run(story, "make third", "third\n")
    queries = story.container.get(Queries)
    requests = tuple(queries.query(ReaderRequest).every_row(TEST_ROWS_REASON))
    story.expect_rows(not queries.query(Process).filter(id=sample.id).exists(),
                      len(requests) == 1, requests[0].sample_process_id is None)


