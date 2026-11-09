from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.base.module.module_finder import ModuleFinder
from tests.stories.core.modules.processes.support.process_samples import end_run, moved_run
from tests.stories.core.support.coding_fixtures import UserBuilder

CHECK_WORDS = "still runs after {minutes} minutes: check it does its work"


def check_tick(story):
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == "output checks"]
    story.expect_rows(len(handlers) == 1)
    handlers[0].handler(story.container)


def wakes(story, process) -> int:
    return story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text.count(f"output {process.id} still runs after")


def waited(story, minutes: int, process) -> int:
    story.advance(timedelta(minutes=minutes))
    check_tick(story)
    return wakes(story, process)


def test_a_confirmed_wait_is_woken_at_5_15_30_and_45_minutes(new_story):
    story = new_story(fixture=UserBuilder)
    process = moved_run(story, "make package", category=CommandCategory.BUILD)
    story.advance(timedelta(minutes=4, seconds=59))
    check_tick(story)
    story.expect_rows(wakes(story, process) == 0)
    story.advance(timedelta(seconds=1))
    check_tick(story)
    story.expect_text(f"agent-line list --agent {story.agent.id}", CHECK_WORDS.format(minutes=5), actor=story.agent)
    story.expect_success(f"output confirm {process.id}", actor=story.agent)
    story.expect_rows(waited(story, 9, process) == 1, waited(story, 1, process) == 2)
    story.expect_text(f"agent-line list --agent {story.agent.id}", CHECK_WORDS.format(minutes=15), actor=story.agent)
    story.expect_success(f"output confirm {process.id}", actor=story.agent)
    story.expect_rows(waited(story, 14, process) == 2, waited(story, 1, process) == 3)
    story.expect_text(f"agent-line list --agent {story.agent.id}", CHECK_WORDS.format(minutes=30), actor=story.agent)
    story.expect_success(f"output confirm {process.id}", actor=story.agent)
    story.expect_rows(waited(story, 14, process) == 3, waited(story, 1, process) == 4)
    story.expect_text(f"agent-line list --agent {story.agent.id}", CHECK_WORDS.format(minutes=45), actor=story.agent)


def test_a_wake_nobody_confirms_comes_again_after_the_same_wait(new_story):
    story = new_story(fixture=UserBuilder)
    process = moved_run(story, "make package", category=CommandCategory.BUILD)
    story.advance(timedelta(minutes=3))
    story.expect_rows(waited(story, 2, process) == 1, waited(story, 4, process) == 1, waited(story, 1, process) == 2)
    story.expect_rows(waited(story, 4, process) == 2, waited(story, 1, process) == 3)


def test_a_confirm_said_twice_moves_the_next_wake_one_step_only(new_story):
    story = new_story(fixture=UserBuilder)
    process = moved_run(story, "make package", category=CommandCategory.BUILD)
    story.expect_rows(waited(story, 5, process) == 1)
    story.expect_success(f"output confirm {process.id}", actor=story.agent)
    story.expect_success(f"output confirm {process.id}", actor=story.agent)
    story.expect_rows(waited(story, 10, process) == 2)
    story.expect_success(f"output confirm {process.id}", actor=story.agent)
    story.expect_rows(waited(story, 14, process) == 2, waited(story, 1, process) == 3)


def test_an_ended_output_is_not_woken_for_and_cannot_be_confirmed(new_story):
    story = new_story(fixture=UserBuilder)
    process = moved_run(story, "make package", category=CommandCategory.BUILD)
    end_run(story, process, "built\n")
    story.run_listeners()
    story.expect_rows(waited(story, 50, process) == 0)
    story.expect_refusal(f"output confirm {process.id}", "not waiting", actor=story.agent)
