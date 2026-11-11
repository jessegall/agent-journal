from tests.stories.core.support.agent_labels import agent_number
from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import JOB, START, EndedHelper, helper_agent, read_jobs, resumable_session
from tests.stories.core.modules.helpers.usage_limits import report
from tests.stories.core.modules.helpers.usage_lockdown import LIMIT, STOP_LINE, lockdown_story

REFUSAL = "no program can take this helper: Claude is at your usage limit until"
LIFT_SUGGESTION = "usage-limit delete 1"


class LimitedEndedHelper(StoryFixture):
    """A helper of journal-researcher that ended after its job, and a limit of 50 percent on Claude."""

    parent = EndedHelper

    def steps(self, story):
        story.expect_success(LIMIT, actor=story.user)


def helper_count(story) -> int:
    return len(story.story_rows(Agent, role="helper"))


def test_a_helper_start_is_refused_with_the_reason_with_no_program_and_with_claude_named_and_no_agent_is_made(new_story):
    story = lockdown_story(new_story)
    FakeLauncher.listening(story.home.socket("launcher"))
    report(story, 55)
    story.expect_refusal(START, REFUSAL, actor=story.agent)
    story.expect_refusal(f"{START} --program claude", REFUSAL, actor=story.agent)
    story.expect_refusal(START, LIFT_SUGGESTION, actor=story.agent)
    story.expect_rows(helper_count(story) == 0)


def test_a_helper_started_on_codex_while_claude_is_locked_down_starts(new_story):
    story = lockdown_story(new_story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    report(story, 55)
    story.expect_success(f"{START} --program codex", actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(helper_count(story) == 1, helper_agent(story).program == "codex", len(launcher.requests) == 1)


def test_a_send_to_an_ended_kept_helper_is_refused_with_the_reason_and_the_same_job_is_sent_once_the_limit_is_lifted(new_story, monkeypatch):
    story = lockdown_story(new_story, fixture=LimitedEndedHelper)
    helper = helper_agent(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    resumable_session(story, helper, monkeypatch)
    report(story, 55)
    story.expect_refusal(f'helper send {agent_number(story, helper.id)} "{JOB}"', REFUSAL, actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(read_jobs(story, helper)) == 1)
    story.expect_success("usage-limit delete 1", actor=story.user)
    story.expect_success(f'helper send {agent_number(story, helper.id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(len(read_jobs(story, helper)) == 2, len(launcher.requests) == 1, detail=str(launcher.requests))


def test_a_program_a_person_starts_by_hand_is_stopped_at_its_session_start_and_no_agent_is_made(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    count = len(story.story_rows(Agent))
    reply = story.hook("s-by-hand", HookSamples.session_start())
    story.expect_rows(reply.halt.startswith(STOP_LINE), len(story.story_rows(Agent)) == count)
