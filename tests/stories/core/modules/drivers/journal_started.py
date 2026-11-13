from core.modules.drivers.support.driver_nudges import JOURNAL_STARTED
from engine.serving.server_files import ServerFiles
from server.work.booting_work import BootingWork
from core.modules.drivers.ticks.released_session_wake import ReleasedSessionWake
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


def test_once_the_server_is_ready_a_worker_whose_hook_the_journal_held_is_woken(new_story):
    story = new_story(fixture=BuilderStarted)
    worker_id = story.new_row_id("agent start s-9 claude worker --environment main")
    ServerFiles(story.home).hold_session("s-9")
    ReleasedSessionWake()(story.container)
    ReleasedSessionWake()(story.container)
    story.run_listeners()
    held = ServerFiles(story.home).held_sessions()
    story.expect_rows(LINE in story.run(f"agent-line list --agent {worker_id}").output_text, not held.path.exists(), not held.taken_path.exists())


def test_a_session_held_while_the_held_sessions_are_moved_aside_is_woken_on_the_next_round(new_story):
    story = new_story(fixture=BuilderStarted)
    early_id = story.new_row_id("agent start s-early claude worker --environment main")
    late_id = story.new_row_id("agent start s-late claude worker --environment main")
    files = ServerFiles(story.home)
    files.hold_session("s-early")
    ReleasedSessionWake()(story.container)
    files.hold_session("s-late")
    ReleasedSessionWake()(story.container)
    story.run_listeners()
    story.expect_rows(LINE in story.run(f"agent-line list --agent {early_id}").output_text, LINE not in story.run(f"agent-line list --agent {late_id}").output_text)
    ReleasedSessionWake()(story.container)
    ReleasedSessionWake()(story.container)
    story.run_listeners()
    story.expect_text(f"agent-line list --agent {late_id}", LINE)
