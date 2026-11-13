from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from core.modules.processes.models.process import Process
from tests.stories.core.modules.processes.hang_watch import HANG_SECONDS
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.core.modules.processes.support.reading_scenarios import agent_number
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.modules.processes.support.process_nudges import BLOCK_LIFTED
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.processes.support.process_nudges import READER_BLOCK

EDIT = HookSamples.edit("cart.py")
PROMPT = HookSamples.prompt("go on")


def held_again(story: Story, process: Process) -> None:
    """The run prints nothing for another hang time, so the hold comes back."""
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_hook_refusal("s-1", EDIT, f"Output {process.id} printed nothing for")


def test_each_exit_of_the_silent_run_hold_works_again_when_the_hold_comes_back(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = moved_run(story, "zork-build bundle", CommandCategory.BUILD)
    story.expect_success(f'output title {process.id} "Building the bundle"', actor=story.agent)
    held_again(story, process)
    for _ in range(2):
        story.expect_success(f"output read {process.id} --tail 5", actor=story.agent)
        story.expect_hook_allowed("s-1", EDIT)
        held_again(story, process)
    number = agent_number(story, story.agent.id)
    for _ in range(2):
        story.expect_success(f"process lift-hold {number} --environment main", "1 holds lifted", actor=story.user)
        story.expect_hook_allowed("s-1", EDIT)
        held_again(story, process)


def test_a_person_lifts_a_workers_reader_block_each_time_one_comes(new_story):
    story = new_story(fixture=ForcedReaders)
    worker = reader_worker(story)
    person = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    number = agent_number(story, worker.id)
    for request, line in ((1, "custom-build run"), (2, "other-build run")):
        worker_run(story, line)
        story.expect_hook_refusal("s-reader", EDIT, expected_nudge(READER_BLOCK))
        story.expect_success(f"process lift-hold {number} --environment main", "1 holds lifted", actor=person)
        story.expect_hook_allowed("s-reader", PROMPT, expected_nudge(BLOCK_LIFTED))
