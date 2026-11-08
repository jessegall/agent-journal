from datetime import timedelta

from core.base.module.module_finder import ModuleFinder
from core.testing.story import Story
from tests.stories.core.modules.processes.support.process_samples import moved_run
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.support.story_checks import expect_value

KEPT = "its output is kept"


def agent_lines(story: Story) -> str:
    return story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text


def timeout_tick(story: Story) -> None:
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == "run timeouts"]
    handlers[0].handler(story.container)


def test_a_person_stopping_a_run_tells_the_agent_its_output_is_kept(new_story):
    story = new_story(fixture=BuilderWithUser)
    process = moved_run(story, "make build")
    story.expect_success(f"output stop {process.id}", actor=story.user)
    expect_value(f"output {process.id} was stopped part way: {KEPT}" in agent_lines(story), True)


def test_an_agent_stopping_its_own_run_is_told_its_output_is_kept(new_story):
    story = new_story(fixture=BuilderWithUser)
    process = moved_run(story, "make package")
    story.advance(timedelta(seconds=3))
    story.expect_success(f"output stop {process.id}", actor=story.agent)
    expect_value(f"output {process.id} was stopped part way: {KEPT}" in agent_lines(story), True)


def test_the_journal_stopping_a_run_for_its_timeout_tells_the_agent_its_output_is_kept(new_story):
    story = new_story(fixture=BuilderWithUser)
    process = moved_run(story, "make test")
    story.expect_success(f"output timeout {process.id} 2m", actor=story.agent)
    story.advance(timedelta(seconds=121))
    timeout_tick(story)
    expect_value(f"output {process.id} timed out after 120 seconds and was stopped: {KEPT}" in agent_lines(story), True)
