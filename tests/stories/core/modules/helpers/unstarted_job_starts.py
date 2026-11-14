from datetime import timedelta

from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.listeners.helper_program_listener import HelperProgramListener
from core.modules.helpers.ticks.unstarted_job_starts import UnstartedJobStarts
from engine.journal.journal_home import LAUNCHER_SOCKET
from tests.stories.core.modules.helpers.helper_jobs import JOB, EndedHelper, helper_agent, resumable_session
from tests.stories.core.support.agent_labels import agent_number


def test_a_job_whose_start_was_lost_is_started_by_the_tick_after_a_minute_and_a_helper_with_a_program_is_not_started_twice(new_story, monkeypatch):
    """The listener that starts a helper's job is switched off here, as when the server stops while it runs."""
    story = new_story(fixture=EndedHelper)
    resumable_session(story, helper_agent(story), monkeypatch)
    monkeypatch.setattr(HelperProgramListener, "handle", lambda listener, event, logged: None)
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=story.agent)
    launcher = FakeLauncher.accepting(story.home.socket(LAUNCHER_SOCKET), request_count=0, answers=(b"\n", b"started 801\n", b"running\n"))
    UnstartedJobStarts()(story.container)
    story.expect_rows(launcher.starts == [], detail="within the first minute the start may still be under way")
    story.advance(timedelta(seconds=61))
    UnstartedJobStarts()(story.container)
    UnstartedJobStarts()(story.container)
    launcher.server.close()
    story.expect_rows(len(launcher.starts) == 1, helper_agent(story).pid == 801, helper_agent(story).ended_at is None, detail=str(launcher.requests))
