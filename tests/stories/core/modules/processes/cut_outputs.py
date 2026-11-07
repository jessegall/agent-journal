import json

import pytest

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.support.grown_outputs import GrownOutputs
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderWithUser

COUNTING_READER = 'reader add counting --commands "cart-suite*" --title "Cart tests" --lines "line" --summary "(line [0-9]+)" --count "total ([0-9]+)" --step "line "'
FIRST_OUTPUT = "total 90\n" + "".join(f"line {number}\n" for number in range(1, 90))
CUT_OUTPUT = "[this output grew past its limit: the oldest lines were dropped]\nline 3\n"
QUEUE_PLAN = Statement("EXPLAIN QUERY PLAN SELECT id FROM processes WHERE environment_id = 1 ORDER BY ended_at DESC, id DESC LIMIT 20")


def advance(story, process):
    story.container.get(Bus).run(ReadNewOutput(process.id), Actor.core(), environment_id=1)


def read_row(story, process):
    return story.container.get(Database).rows(Statement("SELECT read_offset, read_lines FROM outputs WHERE process_id = ?", [process.id]))[0]


@pytest.fixture
def read_run(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.expect_success(COUNTING_READER, actor=story.agent)
    process = moved_run(story, "cart-suite run")
    story.container.get(OutputFolder).write_output(process.id, 1, FIRST_OUTPUT)
    advance(story, process)
    return story, process


def test_a_read_output_has_no_new_bytes(read_run):
    story, process = read_run
    story.expect_rows(not story.container.get(GrownOutputs).has_new_bytes(process.id))


def test_a_cut_counts_as_a_change_for_a_reader(read_run):
    story, process = read_run
    story.container.get(OutputFolder).write_output(process.id, 1, CUT_OUTPUT)
    story.expect_rows(story.container.get(GrownOutputs).has_new_bytes(process.id))


def test_a_reader_after_a_cut_starts_again_and_counts_only_what_is_kept(read_run):
    story, process = read_run
    story.container.get(OutputFolder).write_output(process.id, 1, CUT_OUTPUT)
    advance(story, process)
    read = read_row(story, process)
    story.expect_rows(read["read_offset"] == len(CUT_OUTPUT), read["read_lines"] == 2)


def test_the_finished_list_reads_the_newest_ended_runs_by_its_index(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    plan = json.dumps([dict(row) for row in story.container.get(Database).rows(QUEUE_PLAN)])
    story.expect_rows("processes_environment_ended" in plan, "TEMP B-TREE" not in plan)
