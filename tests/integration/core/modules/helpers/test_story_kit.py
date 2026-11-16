from core.modules.agents.models.agent import Agent
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.stories.helper_started import HELPER_LAUNCH_NAME, HelperStarted
from engine.testing.examples.hook_samples import HookSamples


def test_a_helper_keeps_the_session_the_journal_chose_when_another_comes_under_its_launch_name(played):
    story = played(HelperStarted)
    story.hook("helper-session", HookSamples.helper(HELPER_LAUNCH_NAME))
    story.expect_no_text(f"agent show {story.helper.id}", "session: helper-session")


def test_a_helper_sends_hooks_as_itself(played):
    story = played(HelperStarted)
    session = story.row(Agent, story.helper.id).session
    story.hook(session, HookSamples.helper(HELPER_LAUNCH_NAME))
    story.hook(session, HookSamples.prompt("Read the cart"))
    story.expect_rows(story.container.get(HookCallQuery).newest_agent_hook(story.helper.id) is not None)


def test_the_fake_launcher_keeps_what_it_was_handed(played):
    story = played(HelperStarted)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_text("agent launch claude --environment main", "started main agent", actor=story.user)
    launcher.drain_requests()
    story.expect_rows(launcher.requests[0]["environment"] == "main")
