from core.modules.drivers.support.driver_nudges import JOURNAL_STARTED
from server.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import MainEnvironment

LINE = JOURNAL_STARTED.nudge().text


def started_journal(story):
    BootingWork().run(story.container)
    story.run_listeners()


def test_a_start_of_the_journal_wakes_the_running_main_agent(new_story):
    story = new_story(fixture=BuilderStarted)
    started_journal(story)
    story.expect_text(f"agent-line list --agent {story.agent.id}", LINE)


def test_a_start_with_no_agent_wakes_nobody(new_story):
    story = new_story(fixture=MainEnvironment)
    started_journal(story)
    story.expect_no_text("agent-line list", LINE)


def test_a_start_does_not_wake_an_ended_main_agent(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(f"agent end {story.agent.id}")
    started_journal(story)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", LINE)
