from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.module.module_finder import ModuleFinder
from tests.stories.core.modules.processes.support.process_samples import end_run, moved_run
from tests.stories.core.support.coding_fixtures import UserBuilder

CHECK_TERMS = "has run {minutes} min: check it is doing its work"


def check_tick(story):
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == "output checks"]
    story.expect_rows(len(handlers) == 1)
    handlers[0].handler(story.container)


def wakes(story, process) -> int:
    return story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text.count(f"Output {process.id} has run")


def waited(story, minutes: int, process) -> int:
    story.advance(timedelta(minutes=minutes))
    check_tick(story)
    return wakes(story, process)


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
