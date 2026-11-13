from datetime import timedelta

from engine.actor.actor import Actor
from engine.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.processes.models.process import Process
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.hang_watch import HANG_SECONDS
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run, started_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.core.modules.processes.support.reading_scenarios import agent_number, end_decision, ended_after_a_while
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.modules.processes.support.process_nudges import BLOCK_LIFTED
from core.modules.processes.support.process_nudges import HOLD_LIFTED
from engine.testing.expectations.expect_nudge import said

TEST_ROWS_REASON = "the test reads every row it checks"

EDIT = HookSamples.edit("cart.py")
READ = HookSamples.tool_use("Read", ToolType.READ, ["cart.py"], None)
BUNDLE = "zork-build bundle"
BUNDLE_START = HookSamples.shell(BUNDLE, ShellPart("zork-build", CommandCategory.BUILD, ["bundle"]))
DOCS_START = HookSamples.shell("zork-build docs", ShellPart("zork-build", CommandCategory.BUILD, ["docs"]))
PREVENTED = "has no proper reader"
SKIP = 'refusal skip processes.reading --reason "{reason}" --environment main'


def unread_run(story: Story, line: str = BUNDLE) -> Process:
    """A build of the main agent that ran a while and ended with no reader for its output."""
    return ended_after_a_while(story, started_run(story, line, CommandCategory.BUILD))


def open_blocks(story: Story, agent_id: int) -> tuple[AgentBlock, ...]:
    return tuple(story.container.get(Queries).query(AgentBlock).filter(session_agent_id=agent_id, closed_at=None).every_row(TEST_ROWS_REASON))


class TwoUnreadBuilds(StoryFixture):
    """The main agent ran the same build twice, each a while, and no reader read its output."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        install_runner(story)
        unread_run(story)
        unread_run(story)


def test_two_runs_with_no_change_of_reader_prevent_the_next_start_of_that_command_alone(new_story):
    story = new_story(fixture=TwoUnreadBuilds)
    story.expect_hook_refusal("s-1", BUNDLE_START, f"Output 2 {PREVENTED}: add or fix the reader")
    story.expect_hook_refusal("s-1", BUNDLE_START, "skip this one start and say why")
    story.expect_rows(end_decision(story, story.row(Process, 1))[:2] == ("missing", "suggest"), detail=str(end_decision(story, story.row(Process, 1))))
    story.expect_hook_allowed("s-1", EDIT)
    story.expect_hook_allowed("s-1", DOCS_START)
    story.expect_rows(open_blocks(story, story.agent.id) == ())


def test_a_prevented_start_is_skipped_once_with_a_reason_and_an_empty_reason_is_refused(new_story):
    story = new_story(fixture=TwoUnreadBuilds)
    story.expect_refusal(SKIP.format(reason=" "), "reason", actor=story.agent)
    story.expect_hook_refusal("s-1", BUNDLE_START, PREVENTED)
    story.advance(timedelta(seconds=1))
    story.expect_text(SKIP.format(reason="the bundle prints only compile lines"), "held", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_hook_refusal("s-1", BUNDLE_START, PREVENTED)
    story.expect_success('refusal confirm 1 --tried "a reader of its compile lines found no summary" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_hook_allowed("s-1", BUNDLE_START)


def test_adding_the_reader_resets_the_count_and_the_next_start_goes_on(new_story):
    story = new_story(fixture=TwoUnreadBuilds)
    story.advance(timedelta(minutes=5))
    story.expect_success('reader add bundle --commands "zork-build bundle*" --lines "done" --title "Bundling" --summary "done"', actor=story.agent)
    story.expect_hook_allowed("s-1", BUNDLE_START)


def test_a_worker_is_blocked_while_its_reader_request_waits_and_freed_when_it_expires(new_story):
    story = new_story(fixture=ForcedReaders)
    story.expect_success("setting set journal.core.processes.reader-block-minutes 2 --environment main", actor=story.user)
    worker = reader_worker(story)
    worker_run(story)
    story.expect_hook_refusal("s-reader", EDIT, "has no reader, request 1")
    story.expect_text("process holds", "block of reader request 1", actor=worker)
    story.advance(timedelta(minutes=3))
    story.expect_hook_allowed("s-reader", READ)
    story.expect_no_text("process holds", "block of reader request 1", actor=worker)




def test_a_person_lifts_a_silent_run_hold_and_the_agent_is_told_and_works_on(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = moved_run(story, "make bundle", CommandCategory.BUILD)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_hook_refusal("s-1", EDIT, f"Output {process.id} printed nothing for")
    story.expect_success("process holds", f"hold on output {process.id}: read it; stop it; a user releases it", actor=story.agent)
    story.expect_refusal(f"process lift-hold {agent_number(story, story.agent.id)} --environment main", "only a user lifts a hold", actor=story.agent)
    story.expect_success(f"process lift-hold {agent_number(story, story.agent.id)} --environment main", "1 holds lifted", actor=story.user)
    story.expect_hook_allowed("s-1", EDIT, said(HOLD_LIFTED))


def test_a_person_lifts_a_workers_reader_block_and_the_worker_is_told_and_held_by_it_no_more(new_story):
    story = new_story(fixture=ForcedReaders)
    worker = reader_worker(story)
    worker_run(story)
    story.expect_hook_refusal("s-reader", EDIT, "reader")
    story.expect_text("process holds", "block of reader request 1: add or fix the reader; mark the command unreadable", actor=worker)
    person = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"process lift-hold {agent_number(story, worker.id)} --environment main", "1 holds lifted", actor=person)
    story.expect_hook_allowed("s-reader", HookSamples.prompt("go on"), said(BLOCK_LIFTED, request=1))
    story.expect_hook_refusal("s-reader", EDIT, "Your task has not started")
