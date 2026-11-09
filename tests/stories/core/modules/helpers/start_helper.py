from engine.errors.refusal import Refusal
from core.modules.helpers.support.helper_limits import HelperLimits
from core.testing.story_helper_programs import StoryHelperPrograms
import json

from datetime import timedelta

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder

START = 'helper start journal-researcher --brief "How does the queue hold a run?" --environment main'
CODEX_START = f"{START} --program codex --model gpt-6.1-sol"
PLAIN_START = 'helper start journal-researcher --brief "Read the queue" --environment main'


class LauncherRuns(StoryFixture):
    """A main agent with a person beside it, ready to start helpers."""

    parent = UserBuilder

    def steps(self, story):
        return None


class OneHelperAllowed(StoryFixture):
    """A main agent that may run one helper in environment main."""

    parent = LauncherRuns

    def steps(self, story):
        story.run("setting set journal.core.helpers.read-only-helper-run-limit 1 --environment main", actor=story.user)


def fake_launcher(story, requests=1):
    return FakeLauncher.listening(story.home.socket("launcher"), request_count=requests)


def helpers(story):
    return list(story.container.get(Queries).query(Agent).filter(role="helper").all_rows())


def started(story, line=START, actor=None):
    launcher = fake_launcher(story)
    helper_id = story.new_row_id(line, actor=actor or story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    return helper_id, launcher


def start_source(new_story, fixture, line=START):
    story = new_story(fixture=fixture)
    return story, *started(story, line)


class StartedHelper(StoryFixture):
    """A main agent with one helper of journal-researcher running."""

    parent = LauncherRuns

    def steps(self, story):
        started(story)


def running_helper(story):
    return helpers(story)[0].id


def test_a_start_makes_a_read_only_helper_under_the_main_agent(new_story):
    story = new_story(fixture=StartedHelper)
    helper_id = running_helper(story)
    story.expect_success(f"agent show {helper_id}", "role: helper", "access: read-only", f"parent_id: {story.agent.id}", "profile: journal-researcher")


def test_a_start_keeps_a_job_with_the_whole_brief(new_story):
    story = new_story(fixture=StartedHelper)
    helper_id = running_helper(story)
    job = story.container.get(Queries).query(HelperJob).filter(helper_id=helper_id).first()
    story.expect_rows(job.brief == "How does the queue hold a run?", job.profile == "journal-researcher", job.session_agent_id == story.agent.id)


def test_a_helper_runs_on_the_program_named(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story, CODEX_START)
    story.expect_success(f"agent show {helper_id}", "program: codex", "program_model: gpt-6.1-sol")


def test_a_given_name_shows_on_the_helper(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story, f'{START} --name "Lady Lovelace"')
    story.expect_success(f"agent show {helper_id}", "given_name: Lady Lovelace")


def test_a_start_with_no_model_anywhere_is_refused_naming_the_flag(new_story):
    story = new_story(fixture=LauncherRuns)
    with pytest.raises(Refusal, match="this profile has no model for codex"):
        story.container.get(HelperLimits).checked_model("codex", "")


@pytest.mark.parametrize("line, reason", [
    (f"{START} --program codex --model not-a-model", "may run"),
    ('helper start nobody --brief "Read" --environment main', "journal profile list"),
    ('helper start journal-senior --brief "Read" --environment main', "journal-senior is a Worker: use journal worker dispatch"),
    (f'helper start journal-researcher --brief "{"x" * 100001}" --environment main', "journal doc make"),
], ids=["model", "profile", "worker profile", "long brief"])
def test_a_refused_start_leaves_no_row(new_story, line, reason):
    story = new_story(fixture=LauncherRuns)
    fake_launcher(story)
    story.expect_refusal(line, reason, actor=story.agent)
    story.expect_rows(helpers(story) == [])


def test_a_helper_starts_no_helper(new_story):
    story = new_story(fixture=StartedHelper)
    helper_id = running_helper(story)
    fake_launcher(story)
    story.expect_refusal(START, "say in your report what should be done next", actor=Actor(helper_id, ActorType.AGENT))


def test_a_person_s_start_has_the_main_agent_as_parent(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story, START, story.user)
    story.expect_success(f"agent show {helper_id}", f"parent_id: {story.agent.id}")


def test_at_the_limit_a_start_names_the_running_helpers_and_an_ended_one_gives_its_slot_back(new_story):
    story, helper_id, _ = start_source(new_story, OneHelperAllowed, f'{START} --name "Rosalind Franklin"')
    fake_launcher(story)
    story.expect_refusal(START, f"agent:{helper_id}", actor=story.agent)
    story.home.socket("launcher").unlink()
    story.expect_success(f"agent end {helper_id}", actor=story.user)
    started(story)
    story.expect_rows(len(helpers(story)) == 2)


def test_each_environment_counts_its_own_helpers(new_story):
    story = new_story(fixture=OneHelperAllowed)
    story.run("environment make staging /work/staging")
    staging_main = Actor(story.new_row_id("agent start s-20 claude main --environment staging"), ActorType.AGENT)
    story.run("setting set journal.core.helpers.read-only-helper-run-limit 1 --environment staging", actor=story.user)
    started(story)
    started(story, START.replace("main", "staging"), staging_main)
    story.expect_rows(len(helpers(story)) == 2)


def test_a_long_brief_arrives_whole(new_story):
    story = new_story(fixture=LauncherRuns)
    brief = "x" * 6000
    _, launcher = started(story, f'helper start journal-researcher --brief "{brief}" --environment main')
    story.expect_rows(brief in " ".join(launcher.requests[0]["command"]))


def test_a_failed_launch_ends_the_helper_and_tells_the_parent(new_story):
    story = new_story(fixture=LauncherRuns)
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"failed\n")
    helper_id = story.new_row_id(f"{START} --model opus", actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_text(f"agent show {helper_id}", "ended_at: 20")
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"agent:{helper_id} could not start")


def test_a_helper_with_no_hook_after_a_minute_ends_and_the_parent_is_told(new_story):
    story = new_story(fixture=StartedHelper)
    helper_id = running_helper(story)
    story.advance(timedelta(seconds=61))
    story.hook("s-1", HookSamples.tick())
    story.run_listeners()
    story.expect_text(f"agent show {helper_id}", "ended_at: 20")
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"agent:{helper_id} could not start")


def test_a_helper_that_sent_a_hook_stays(new_story):
    story = new_story(fixture=StartedHelper)
    helper_id = running_helper(story)
    session = story.container.get(Queries).query(Agent).find(helper_id).session
    story.hook(session, HookSamples.helper(session))
    story.advance(timedelta(seconds=61))
    story.hook("s-1", HookSamples.tick())
    story.run_listeners()
    story.expect_no_text(f"agent show {helper_id}", "ended_at: 20")


def refuse_claude(monkeypatch):
    def refusing(programs, program, folder):
        if program == "claude":
            raise Refusal("claude is not installed here", "install claude or name another program")
    monkeypatch.setattr(StoryHelperPrograms, "checked", refusing)


def save_profile(story, flags):
    story.expect_success(f'profile save journal-researcher --description "Reads and reports" --program claude {flags} --environment main', actor=story.user)


def test_a_profile_that_always_uses_its_program_is_refused_when_it_cannot_start(new_story, monkeypatch):
    story = new_story(fixture=LauncherRuns)
    save_profile(story, "--no-program-if-possible")
    refuse_claude(monkeypatch)
    fake_launcher(story)
    story.expect_refusal(START, "claude is not installed", actor=story.agent)
    story.expect_rows(helpers(story) == [])


def test_a_profile_that_uses_its_program_if_possible_starts_on_the_other_one_and_says_why(new_story, monkeypatch):
    story = new_story(fixture=LauncherRuns)
    save_profile(story, "--program-if-possible --codex-model gpt-6.1-sol")
    refuse_claude(monkeypatch)
    launcher = fake_launcher(story)
    answer = json.loads(story.run(f"{PLAIN_START} --json", actor=story.agent).output_text.splitlines()[0])
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.expect_rows(answer["program"] == "codex", answer["note"] == "claude could not start (claude is not installed here: install claude or name another program), so it runs on codex")
    story.expect_success(f"agent show {answer['id']}", "program: codex", "program_model: gpt-6.1-sol")


def test_a_profile_that_uses_its_program_if_possible_keeps_it_when_it_can_start(new_story):
    story = new_story(fixture=LauncherRuns)
    save_profile(story, "--program-if-possible")
    helper_id, _ = started(story, f'{START} --name "Marie"')
    story.expect_success(f"agent show {helper_id}", "program: claude")


def test_a_profile_that_says_nothing_falls_back_to_another_program(new_story, monkeypatch):
    story = new_story(fixture=LauncherRuns)
    save_profile(story, "--codex-model gpt-6.1-sol")
    refuse_claude(monkeypatch)
    launcher = fake_launcher(story)
    answer = json.loads(story.run(f"{PLAIN_START} --json", actor=story.agent).output_text.splitlines()[0])
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.expect_rows(answer["program"] == "codex")


def test_a_helper_launch_waits_for_its_own_round_and_holds_no_ordinary_listener(new_story, monkeypatch):
    story = new_story(fixture=LauncherRuns)
    launcher = fake_launcher(story)
    monkeypatch.setattr(CommitListenerRunner, "run", lambda _runner: None)
    story.new_row_id(START, actor=story.agent)
    runner = story.container.get(CommitListenerRunner)
    runner.run_urgent()
    runner.run_ordinary()
    story.expect_rows(launcher.requests == [])
    runner.run_program_stops()
    launcher.drain_requests()
    story.expect_rows(len(launcher.requests) == 1)
