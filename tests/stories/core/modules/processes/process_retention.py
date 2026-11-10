from datetime import timedelta

from core.base.command.bus import Bus
from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, start_process
from tests.stories.core.modules.processes.support.reader_block_fixtures import worker_run
from tests.stories.core.support.coding_fixtures import UserBuilder


class ProcessLog(StoryFixture):
    """The process log keeps two ended runs beside its running commands."""

    parent = UserBuilder

    def steps(self, story):
        story.run("setting set journal.core.processes.processes-kept 2 --environment main", actor=story.user)


def test_old_processes_parts_outputs_and_folders_are_removed_together(new_story):
    story = new_story(fixture=ProcessLog)
    first = ended_run(story, "make first", "first\n")
    second = ended_run(story, "make second", "second\n")
    third = ended_run(story, "make third", "third\n")
    story.run_listeners()
    queries = story.container.get(Queries)
    story.expect_rows(not queries.query(Process).filter(id=first.id).exists(),
                      not queries.query(ProcessPart).filter(process_id=first.id).exists(),
                      not queries.query(Output).filter(process_id=first.id).exists(),
                      story.container.get(OutputFolder).process_ids() == [second.id, third.id])
    story.run_listeners()


def test_running_processes_remain_beside_the_newest_ended_runs(new_story):
    story = new_story(fixture=ProcessLog)
    running = start_process(story, "make active", category=CommandCategory.BUILD)
    for number in range(4):
        ended_run(story, f"make finished-{number}", "done\n")
    queries = story.container.get(Queries)
    story.expect_rows(queries.query(Process).count() == 3,
                      queries.query(Process).find(running.id).ended_at is None,
                      queries.query(Output).filter(process_id=running.id).exists(),
                      running.id in story.container.get(OutputFolder).process_ids())
    story.expect_refusal(f"process delete {running.id}", "running", actor=story.agent)


def test_a_long_run_is_kept_when_it_finishes_after_newer_short_runs(new_story):
    story = new_story(fixture=ProcessLog)
    long_run = start_process(story, "make everything", category=CommandCategory.BUILD)
    first = ended_run(story, "make first", "first\n")
    story.advance(timedelta(seconds=1))
    ended_run(story, "make second", "second\n")
    story.advance(timedelta(seconds=1))
    end_run(story, long_run, "complete\n")
    queries = story.container.get(Queries)
    story.expect_rows(queries.query(Process).filter(id=long_run.id).exists(),
                      not queries.query(Process).filter(id=first.id).exists())


def test_short_output_is_kept_with_its_process(new_story):
    story = new_story(fixture=ProcessLog)
    process = start_process(story, "ls cart", category=CommandCategory.READ)
    story.container.get(OutputFolder).write_output(process.id, 1, "cart\n")
    bus = story.container.get(Bus)
    bus.run(EndProcessPart(process.id, 1, 0), story.agent, environment_id=1)
    bus.run(EndProcess(process.id, 0, 5, 1), story.agent, environment_id=1)
    story.expect_rows(story.container.get(Queries).query(Output).filter(process_id=process.id).exists())
    story.expect_text(f"output peek {process.id} --all", "cart", actor=story.user)


def test_deleting_an_ended_process_also_removes_its_folder(new_story):
    story = new_story(fixture=ProcessLog)
    process = ended_run(story, "make package", "built\n")
    story.expect_success(f"process delete {process.id}", actor=story.agent)
    story.expect_rows(process.id not in story.container.get(OutputFolder).process_ids())


def test_a_reader_request_loses_its_sample_when_the_sample_is_removed(new_story):
    story = new_story(fixture=ProcessLog)
    story.run("agent start s-reader claude worker --environment main")
    sample = worker_run(story, "custom-build sample")
    end_run(story, sample, "sample\n")
    ended_run(story, "make second", "second\n")
    ended_run(story, "make third", "third\n")
    queries = story.container.get(Queries)
    requests = tuple(queries.query(ReaderRequest).all_rows())
    story.expect_rows(not queries.query(Process).filter(id=sample.id).exists(),
                      len(requests) == 1, requests[0].sample_process_id is None)


def test_each_environment_keeps_its_own_process_count(new_story):
    story = new_story(fixture=ProcessLog)
    ended_run(story, "make main-first", "first\n")
    ended_run(story, "make main-second", "second\n")
    story.run("environment make web /work/web", actor=story.user)
    story.expect_success("setting set journal.core.processes.processes-kept 1 --environment web", actor=story.user)
    web = Actor(story.new_row_id("agent start web-main claude main --environment web"), ActorType.AGENT)
    bus = story.container.get(Bus)
    for number in range(2):
        process = bus.run(StartProcess.single_part(web.id, f"make web-{number}", "/work/web", CommandCategory.BUILD, 30), web, environment_id=2)
        end_run(story, process, "web\n")
    queries = story.container.get(Queries)
    story.expect_rows(queries.query(Process).filter(environment_id=1).count() == 2,
                      queries.query(Process).filter(environment_id=2).count() == 1)
