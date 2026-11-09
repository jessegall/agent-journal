from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted, OpenTaskBuilder, CodingEnvironment


def test_a_main_agent_with_auto_on_that_stops_with_nothing_in_hand_is_started_on_the_open_task(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "task:1 is yours now")
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {story.agent.id}")
    story.expect_success(lines.SECOND_HOOK_CALL, "hook: stop", "suite: coding", "driver: coding.main", "answer: refused")


def test_a_main_agent_with_auto_off_that_stops_is_not_given_the_open_task(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.run("setting make journal.suites.coding.auto-mode false")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "can go to a worker and a place is free")
    story.expect_hook_allowed("s-1", HookSamples.stop())
    story.expect_success(lines.TASK_DETAILS, "state: open")


def test_a_main_agent_with_auto_on_is_told_it_is_the_main_agent_when_its_session_starts(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), "You are the main agent")


def test_a_main_agent_with_auto_on_given_a_task_is_told_its_brief(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the tax" --brief "Round it at the end" --environment main')
    story.expect_hook_refusal("s-1", HookSamples.stop(), "task:1 is yours now")


def test_a_main_agent_with_auto_on_the_journal_started_is_told_to_introduce_itself(new_story):
    story = new_story(fixture=CodingEnvironment)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_text("agent launch claude --environment main", "started agent", actor=user)
    launcher.drain_requests()
    name = launcher.requests[0]["session"]
    story.expect_hook_allowed(name, HookSamples.session_start().with_fields(launch=name), "introduce yourself in the chat")
