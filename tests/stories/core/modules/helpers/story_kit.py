from core.modules.agents.models.agent import Agent
from core.base.query.queries import Queries
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.testing.fake_launcher import FakeLauncher
from core.testing.helper_started import HELPER_LAUNCH_NAME, HelperStarted
from core.testing.hook_samples import HookSamples


def test_a_helper_keeps_the_session_the_journal_chose_when_another_comes_under_its_launch_name(new_story):
    story = new_story(fixture=HelperStarted)
    story.hook("helper-session", HookSamples.helper(HELPER_LAUNCH_NAME))
    story.expect_no_text(f"agent show {story.helper.id}", "session: helper-session")


def test_a_helper_sends_hooks_as_itself(new_story):
    story = new_story(fixture=HelperStarted)
    session = story.container.get(Queries).query(Agent).find(story.helper.id).session
    story.hook(session, HookSamples.helper(HELPER_LAUNCH_NAME))
    story.hook(session, HookSamples.prompt("Read the cart"))
    story.expect_rows(story.container.get(HookCallQuery).newest_agent_hook(story.helper.id) is not None)


def test_the_fake_launcher_keeps_what_it_was_handed(new_story):
    story = new_story(fixture=HelperStarted)
    launcher = FakeLauncher(story.home.socket("launcher")).serve()
    story.expect_text("agent launch claude --environment main", "started agent", actor=story.user)
    launcher.drain_requests()
    story.expect_rows(launcher.requests[0]["environment"] == "main")
