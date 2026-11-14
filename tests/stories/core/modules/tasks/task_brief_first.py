import sqlite3

from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.documents.models.link import Link
from core.modules.tasks.models.task_read import TaskRead

from core.modules.documents.support.work_context_reader import WorkContextReader
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from unittest.mock import patch

from tests.stories.core.modules.processes.support.process_samples import install_runner
from engine.database.database import Database
from datetime import timedelta

from engine.enums.command_category import CommandCategory
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted, ReadTaskBuilder, UnreadTaskBuilder, BriefedTaskBuilder
from core.modules.processes.support.process_nudges import READ_COMMAND_OUTPUT
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.tasks.support.task_nudges import TASK_BRIEF_FIRST

EDIT = HookSamples.edit("src/cart.py")
BRIEF_LINE = HookSamples.shell("journal task overview 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "overview", "1"], subcommand="task"))
COMPACTION = HookSamples.sample("compact")
BRIEF_REFUSAL = TASK_BRIEF_FIRST.nudge(task=1).text


def briefs_required(story) -> None:
    story.container.get(TaskBriefRequirement).is_required = True


def test_the_brief_command_prints_the_title_the_brief_and_the_comments(new_story):
    story = new_story(fixture=BriefedTaskBuilder)
    story.run('task comment 1 "use the new cart" --environment main', actor=story.user)
    story.expect_text("task overview 1", "task 1: Fix the cart", "the total is in cents", "use the new cart", actor=story.agent)


def test_the_brief_command_says_when_a_task_has_no_comments(new_story):
    story = new_story(fixture=BriefedTaskBuilder)
    story.expect_text("task overview 1", "no comments on task 1", actor=story.agent)


def test_a_task_handed_to_an_agent_blocks_it_until_it_read_the_brief(new_story):
    story = new_story(fixture=UnreadTaskBuilder)
    story.expect_hook_refusal("s-1", EDIT, BRIEF_REFUSAL)
    story.expect_hook_allowed("s-1", BRIEF_LINE)


def test_running_the_brief_command_releases_the_block(new_story):
    story = new_story(fixture=UnreadTaskBuilder)
    story.expect_text("task overview 1", "task 1: Fix the cart", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_two_unread_tasks_hold_two_blocks_so_reading_one_leaves_the_other(new_story):
    story = new_story(fixture=UnreadTaskBuilder)
    story.run('task make "Second" --brief "A second job" --environment main', actor=story.user)
    story.run("task start 2", actor=story.agent)
    story.run("task overview 2", actor=story.agent)
    story.expect_hook_refusal("s-1", EDIT, BRIEF_REFUSAL)
    story.run("task overview 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_task_already_read_in_this_window_raises_no_block(new_story):
    story = new_story(fixture=ReadTaskBuilder)
    briefs_required(story)
    story.run('task release 1 --reason "later"', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_compaction_blocks_the_agent_again_until_it_reads_the_brief(new_story):
    story = new_story(fixture=ReadTaskBuilder)
    briefs_required(story)
    story.hook("s-1", COMPACTION)
    story.expect_hook_refusal("s-1", EDIT, BRIEF_REFUSAL)
    story.run("task overview 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_compaction_asks_only_for_the_last_started_task_and_the_earlier_one_when_the_agent_goes_back_to_it(new_story):
    story = new_story(fixture=BuilderStarted)
    briefs_required(story)
    story.run('task make "First" --brief "A first job" --environment main', actor=story.agent)
    story.run('task make "Second" --brief "A second job" --environment main', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_success("task overview 1", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_success("task start 2", actor=story.agent)
    story.expect_success("task overview 2", actor=story.agent)
    story.hook("s-1", COMPACTION)
    story.expect_hook_refusal("s-1", EDIT, TASK_BRIEF_FIRST.nudge(task=2).text)
    story.run("task overview 2", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)
    story.run('task close 2 --outcome "done"', actor=story.agent)
    story.expect_hook_refusal("s-1", EDIT, BRIEF_REFUSAL)
    story.run("task overview 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_task_started_by_a_person_blocks_no_agent(new_story):
    story = new_story(fixture=BriefedTaskBuilder)
    briefs_required(story)
    story.run("task start 1", actor=story.user)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_story_that_is_not_about_the_brief_is_not_blocked(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_resetting_many_task_reads_reads_each_row_no_more(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    for number in range(30):
        task_id = story.new_row_id(f'task make "Read me {number}"', actor=story.agent)
        story.expect_success(f"task overview {task_id}", actor=story.agent)
    links = story.container.get(Queries).query(Link)
    story.expect_rows(not links.filter(source_model="task_read").exists(), not links.filter(target_model="task_read").exists())
    with patch.object(Database, "rows", autospec=True, side_effect=Database.rows) as reads:
        story.expect_hook_allowed("s-1", COMPACTION)
    link_reads = [call.args[1] for call in reads.call_args_list if "FROM links " in call.args[1].sql]
    story.expect_rows(len(link_reads) == 2)
    story.expect_rows(not story.container.get(Queries).query(TaskRead).filter(session_agent_id=story.agent.id).exists())


def test_reading_the_overview_context_holds_no_write_lock(new_story, monkeypatch):
    story = new_story(fixture=UnreadTaskBuilder)
    original = WorkContextReader.overview
    observed = []

    def read_without_lock(reader, task, caller):
        writer = sqlite3.connect(story.home.database, timeout=0, autocommit=True)
        try:
            writer.execute("BEGIN IMMEDIATE")
            observed.append(True)
            return original(reader, task, caller)
        finally:
            writer.rollback()
            writer.close()

    monkeypatch.setattr(WorkContextReader, "overview", read_without_lock)
    story.expect_success("task overview 1", actor=story.agent)
    story.expect_rows(observed == [True])


def test_an_overview_that_cannot_read_its_context_records_no_task_read(new_story, monkeypatch):
    story = new_story(fixture=UnreadTaskBuilder)

    def unavailable(reader, task, caller):
        raise Refusal("the context is unavailable")

    monkeypatch.setattr(WorkContextReader, "overview", unavailable)
    story.expect_refusal("task overview 1", "the context is unavailable", actor=story.agent)
    reads = story.container.get(Queries).query(TaskRead).filter(task_id=1, session_agent_id=story.agent.id)
    story.expect_rows(not reads.exists())


def test_redirecting_or_piping_a_task_overview_does_not_mark_the_brief_read(new_story):
    story = install_runner(new_story(fixture=UnreadTaskBuilder))
    part = ShellPart("journal", CommandCategory.JOURNAL, ["task", "overview", "1"], subcommand="task")
    story.expect_hook_refusal("s-1", HookSamples.shell("journal task overview 1 > /tmp/task", part, redirects=["> /tmp/task"]), BRIEF_REFUSAL)
    piped = ShellPart("journal", CommandCategory.JOURNAL, ["task", "overview", "1"], subcommand="task", pipe_target=1)
    sink = ShellPart("cat", CommandCategory.READ, [])
    story.expect_hook_refusal("s-1", HookSamples.shell("journal task overview 1 && cat", piped, sink), expected_nudge(READ_COMMAND_OUTPUT))
    story.expect_rows(not story.container.get(Queries).query(TaskRead).filter(task_id=1, session_agent_id=story.agent.id).exists())
    story.expect_success("task overview 1", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(TaskRead).filter(task_id=1, session_agent_id=story.agent.id).exists())
