from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.agents.support.agent_type_limits import AgentTypeLimits, TypeLimits
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.testing.fake_launcher import FakeLauncher
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent, resumable_session

REASON = '--reason "Its question is answered"'


class EndedHelper(StoryFixture):
    """The helper of StartedHelper with its process stopped."""

    parent = StartedHelper

    def steps(self, story):
        helper = helper_agent(story)
        story.expect_success(f"agent edit {helper.id} --pid 4242", actor=story.user)
        story.expect_success(f"agent stop {helper.id}", actor=story.agent)


def expect_start_refused(story, reason: str) -> None:
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_refusal('helper start journal-researcher --fresh --brief "Read src/till.py" --environment main', reason, actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_a_helper_stays_idle_when_its_process_stops(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_rows(helper.ended_at is not None, helper.retired_at is None, helper.session != "")


def test_retire_with_a_reason_keeps_its_record_and_it_is_not_retired_again(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_success(f"agent retire {helper.id} {REASON}", f"retired agent {helper.id}", actor=story.agent)
    retired = helper_agent(story)
    story.expect_rows(retired.retired_at is not None, retired.retirement_reason == "Its question is answered", retired.retiring_actor_id == story.agent.id)
    story.expect_refusal(f"agent retire {helper.id} {REASON}", "retired already", actor=story.agent)


def test_retire_needs_a_reason_and_an_ended_agent(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f"agent retire {helper.id} {REASON}", "still running", actor=story.agent)
    story.expect_success(f"agent edit {helper.id} --pid 4242", actor=story.user)
    story.expect_success(f"agent stop {helper.id}", actor=story.agent)
    story.expect_refusal(f'agent retire {helper.id} --reason " "', "needs its reason", actor=story.agent)


def test_retire_permissions(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f"agent retire {story.agent.id} {REASON}", "main agent is not retired", actor=story.agent)
    story.expect_refusal(f"agent retire {helper.id} {REASON}", "answers to", actor=Actor(helper.id, ActorType.AGENT))
    story.expect_success(f"agent retire {helper.id} {REASON}", actor=story.user)


def test_retired_row_stays_retired(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f'agent edit {helper.id} --retirement-reason "Old"', "does not change a retirement", actor=story.user)
    story.expect_success(f"agent retire {helper.id} {REASON}", actor=story.agent)
    story.expect_refusal(f'agent edit {helper.id} --retirement-reason ""', "does not change a retirement", actor=story.user)
    story.expect_refusal(f"agent delete {helper.id}", "record stays", actor=story.user)
    story.expect_refusal(f'helper send {helper.id} "One more job"', "retired, for good", actor=story.agent)
    story.expect_rows(helper_agent(story).retired_at is not None)


def test_session_gone_says_retire(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f'helper send {helper.id} "One more job"', f"journal agent retire {helper.id}", actor=story.agent)


def test_old_callback_leaves_the_new_run(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f"agent edit {helper.id} --pid 4242", actor=story.user)
    story.expect_success(f"agent exited {helper.id} 0 --pid 1111", actor=story.user)
    story.expect_rows(helper_agent(story).ended_at is None)
    story.expect_success(f"agent exited {helper.id} 0 --pid 4242", actor=story.user)
    story.expect_rows(helper_agent(story).ended_at is not None)


def test_a_person_sets_the_limits_of_a_profile_and_a_number_in_a_profile_file_is_not_read(new_story):
    story = new_story(fixture=StartedHelper)
    limits = story.container.get(AgentTypeLimits)
    story.expect_rows(limits.of("helper", "journal-researcher") == TypeLimits(4, 8), limits.of("main") is None)
    story.expect_success('setting set journal.core.helpers.helper-profile-limits \'["journal-researcher:1:2"]\' --project', actor=story.user)
    story.expect_rows(story.container.get(AgentTypeLimits).of("helper", "journal-researcher") == TypeLimits(1, 2))
    story.expect_rows(story.container.get(AgentTypeLimits).of("helper", "journal-planner") == TypeLimits(4, 8))


def test_at_the_run_limit_a_start_of_that_profile_is_refused_and_another_profile_starts(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success('setting set journal.core.helpers.helper-profile-limits \'["journal-researcher:1:8"]\' --project', actor=story.user)
    expect_start_refused(story, "1 of journal-researcher run")
    story.expect_rows(story.container.get(AgentTypeLimits).of("helper", "journal-debugger") == TypeLimits(4, 8))


def test_at_the_kept_maximum_a_new_start_is_refused_with_a_retire_line(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_success('setting set journal.core.helpers.helper-profile-limits \'["journal-researcher:4:1"]\' --project', actor=story.user)
    expect_start_refused(story, f"journal agent retire {helper.id}")


def test_launches_in_flight_count(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    story.expect_success('setting set journal.core.helpers.helper-profile-limits \'["journal-researcher:1:8"]\' --project', actor=story.user)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_success(f'helper send {helper.id} "One more job"', actor=story.agent)
    story.expect_refusal(f'helper send {helper.id} "And another"', "1 of journal-researcher run", actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_a_start_with_an_idle_helper_is_refused_with_its_send_line(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_refusal('helper start journal-researcher --brief "Read src/till.py" --environment main', f'helper {helper.id} is idle: journal helper send {helper.id} "<job>"', actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_an_idle_helper_on_another_model_or_with_its_session_gone_is_not_offered(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    kept = story.container.get(KeptHelpers)
    story.expect_rows(kept.idle("journal-researcher", "", "") == ())
    resumable_session(story, helper, monkeypatch)
    story.expect_rows(kept.idle("journal-researcher", "", "")[0].id == helper.id, kept.idle("journal-researcher", "", "another-model") == ())
