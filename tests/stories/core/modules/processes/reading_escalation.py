from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.hang_watch import HANG_SECONDS
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.core.modules.processes.support.reading_scenarios import agent_number
from tests.stories.core.support.coding_fixtures import UserBuilder

EDIT = HookSamples.edit("cart.py")


def test_a_person_lifts_a_silent_run_hold_and_the_agent_is_told_and_works_on(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = moved_run(story, "make bundle", CommandCategory.BUILD)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_hook_refusal("s-1", EDIT, f"output {process.id} printed nothing for")
    story.expect_success("process holds", f"hold on output {process.id}: read it; stop it; a person releases it", actor=story.agent)
    story.expect_refusal(f"process lift-hold {agent_number(story, story.agent.id)} --environment main", "only a person lifts a hold", actor=story.agent)
    story.expect_success(f"process lift-hold {agent_number(story, story.agent.id)} --environment main", "1 holds lifted", actor=story.user)
    story.expect_hook_allowed("s-1", EDIT, f"the hold on output {process.id} was lifted by a person")


def test_a_person_lifts_a_workers_reader_block_and_the_worker_is_told_and_held_by_it_no_more(new_story):
    story = new_story(fixture=ForcedReaders)
    worker = reader_worker(story)
    worker_run(story)
    story.expect_hook_refusal("s-reader", EDIT, "reader")
    story.expect_text("process holds", "block of reader request 1: add or fix the reader; mark the command unreadable", actor=worker)
    person = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"process lift-hold {agent_number(story, worker.id)} --environment main", "1 holds lifted", actor=person)
    story.expect_hook_allowed("s-reader", HookSamples.prompt("go on"), "the block of reader request 1 was lifted by a person")
    story.expect_hook_refusal("s-reader", EDIT, "your task has not started yet")
