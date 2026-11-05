
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.support.helper_nudges import HELPER_UNSTARTED
from core.testing.expect_reply import expect_reply_line
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser

START = 'helper start journal-researcher --brief "How does the queue hold a run?" --environment main'
CODEX_START = f"{START} --program codex --model gpt-6.1-sol"


class LauncherRuns(StoryFixture):
    """A main agent with a person beside it, ready to start helpers."""

    parent = BuilderWithUser

    def steps(self, story):
        return None


class OneHelperAllowed(StoryFixture):
    """A main agent that may run one helper in environment main."""

    parent = LauncherRuns

    def steps(self, story):
        story.run("setting set journal.core.helpers.helper-limit 1 --environment main", actor=story.user)


def launcher_of(story, requests=1):
    return FakeLauncher(story.home.socket("launcher"), request_count=requests)


def helpers(story):
    return list(story.container.get(Queries).query(Agent).filter(role="helper").all_rows())


def started(story, line=START, actor=None):
    launcher = launcher_of(story)
    helper_id = story.new_row_id(line, actor=actor or story.agent)
    story.run_listeners()
    launcher.thread.join(timeout=5)
    return helper_id, launcher


def test_a_start_makes_a_read_only_helper_under_the_main_agent(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story)
    story.expect_success(f"agent show {helper_id}", "role: helper", "access: read-only", f"parent_id: {story.agent.id}", "profile: journal-researcher")


def test_a_start_keeps_a_job_with_the_whole_brief(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story)
    job = story.container.get(Queries).query(HelperJob).filter(helper_id=helper_id).first()
    story.expect_rows(job.brief == "How does the queue hold a run?", job.profile == "journal-researcher", job.agent_id == story.agent.id)


def test_the_launcher_gets_the_program_in_the_parent_s_folder(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, launcher = started(story)
    request = launcher.requests[0]
    story.expect_rows(request["agent_id"] == helper_id, request["folder"] == "/work/journal", request["environment"] == "main")


def test_the_brief_opens_with_the_helper_s_number_and_holds_its_job(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, launcher = started(story)
    command = " ".join(launcher.requests[0]["command"])
    story.expect_rows(f"You are helper {helper_id}." in command, "How does the queue hold a run?" in command)


def test_a_helper_runs_on_the_program_named(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story, CODEX_START)
    story.expect_success(f"agent show {helper_id}", "program: codex", "program_model: gpt-6.1-sol")


def test_with_no_program_a_helper_runs_on_its_parent_s(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story)
    story.expect_success(f"agent show {helper_id}", "program: claude")


def test_with_no_model_the_profile_s_model_for_that_program_is_used(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story)
    story.expect_success(f"agent show {helper_id}", "program_model: sonnet")


def test_a_given_name_shows_on_the_helper(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story, f'{START} --name "Lady Lovelace"')
    story.expect_success(f"agent show {helper_id}", "given_name: Lady Lovelace")


def test_a_model_the_program_may_not_run_leaves_no_row(new_story):
    story = new_story(fixture=LauncherRuns)
    launcher_of(story)
    story.expect_refusal(f"{START} --program codex --model not-a-model", "may run", actor=story.agent)
    story.expect_rows(helpers(story) == [])


def test_an_unknown_profile_names_the_list(new_story):
    story = new_story(fixture=LauncherRuns)
    launcher_of(story)
    story.expect_refusal('helper start nobody --brief "Read" --environment main', "journal profile list", actor=story.agent)


def test_a_profile_of_a_worker_names_its_own_start(new_story):
    story = new_story(fixture=LauncherRuns)
    launcher_of(story)
    story.expect_refusal('helper start journal-senior --brief "Read" --environment main', "journal-senior is a Worker: use journal worker dispatch", actor=story.agent)


def test_a_helper_starts_no_helper(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story)
    launcher_of(story)
    story.expect_refusal(START, "say in your report what should be done next", actor=Actor(helper_id, ActorType.AGENT))


def test_a_person_s_start_has_the_main_agent_as_parent(new_story):
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story, START, story.user)
    story.expect_success(f"agent show {helper_id}", f"parent_id: {story.agent.id}")


def test_no_launcher_is_refused_before_any_row(new_story):
    story = new_story(fixture=LauncherRuns)
    story.expect_refusal(START, "journal launch", actor=story.agent)
    story.expect_rows(helpers(story) == [])


def test_at_the_limit_a_start_names_the_running_helpers(new_story):
    story = new_story(fixture=OneHelperAllowed)
    helper_id, _ = started(story)
    launcher_of(story)
    story.expect_refusal(START, f"agent:{helper_id}", actor=story.agent)


def test_an_ended_helper_gives_its_slot_back(new_story):
    story = new_story(fixture=OneHelperAllowed)
    helper_id, _ = started(story)
    story.expect_success(f"agent end {helper_id}", actor=story.user)
    started(story)
    story.expect_rows(len(helpers(story)) == 2)


def test_each_environment_counts_its_own_helpers(new_story):
    story = new_story(fixture=OneHelperAllowed)
    story.run("environment make staging /work/staging")
    staging_main = Actor(story.new_row_id("agent start s-20 claude main --environment staging"), ActorType.AGENT)
    story.run("setting set journal.core.helpers.helper-limit 1 --environment staging", actor=story.user)
    started(story)
    started(story, START.replace("main", "staging"), staging_main)
    story.expect_rows(len(helpers(story)) == 2)


def test_a_long_brief_arrives_whole(new_story):
    story = new_story(fixture=LauncherRuns)
    brief = "x" * 6000
    _, launcher = started(story, f'helper start journal-researcher --brief "{brief}" --environment main')
    story.expect_rows(brief in " ".join(launcher.requests[0]["command"]))


def test_a_brief_over_the_limit_names_a_document(new_story):
    story = new_story(fixture=LauncherRuns)
    launcher_of(story)
    story.expect_refusal(f'helper start journal-researcher --brief "{"x" * 100001}" --environment main', "journal doc make", actor=story.agent)
    story.expect_rows(helpers(story) == [])


def test_a_failed_launch_ends_the_helper_and_tells_the_parent(new_story):
    story = new_story(fixture=LauncherRuns)
    launcher = FakeLauncher(story.home.socket("launcher"), answer=b"failed\n")
    helper_id = story.new_row_id(START, actor=story.agent)
    story.run_listeners()
    launcher.thread.join(timeout=5)
    story.expect_text(f"agent show {helper_id}", "ended_at: 20")
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"agent:{helper_id} could not start")


def test_a_helper_with_no_hook_after_a_minute_ends_and_the_parent_is_told(new_story):
    from datetime import timedelta
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story)
    story.advance(timedelta(seconds=61))
    reply = story.hook("s-1", HookSamples.tick())
    story.run_listeners()
    expect_reply_line(reply, HELPER_UNSTARTED.nudge(agent=helper_id).text)
    story.expect_text(f"agent show {helper_id}", "ended_at: 20")


def test_a_helper_that_sent_a_hook_stays(new_story):
    from datetime import timedelta
    story = new_story(fixture=LauncherRuns)
    helper_id, _ = started(story)
    session = story.container.get(Queries).query(Agent).find(helper_id).session
    story.hook("helper-1", HookSamples.helper(session))
    story.advance(timedelta(seconds=61))
    story.hook("s-1", HookSamples.tick())
    story.run_listeners()
    story.expect_no_text(f"agent show {helper_id}", "ended_at: 20")
