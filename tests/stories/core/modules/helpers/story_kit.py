from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.testing.fake_launcher import FakeLauncher
from core.testing.helper_started import HELPER_LAUNCH_NAME, HelperStarted
from core.testing.hook_samples import HookSamples


def test_a_helper_row_binds_its_real_session_with_its_first_hook(new_story):
    story = new_story(fixture=HelperStarted)
    story.hook("helper-session", HookSamples.helper(HELPER_LAUNCH_NAME))
    story.expect_success(f"agent show {story.helper.id}", "session: helper-session", "role: helper")


def test_a_helper_sends_hooks_as_itself(new_story):
    story = new_story(fixture=HelperStarted)
    story.hook("helper-session", HookSamples.helper(HELPER_LAUNCH_NAME))
    story.hook("helper-session", HookSamples.prompt("Read the cart"))
    story.expect_rows(story.container.get(HookCallQuery).newest_agent_hook(story.helper.id) is not None)


def test_the_fake_launcher_keeps_what_it_was_handed(new_story):
    story = new_story(fixture=HelperStarted)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_text("agent launch claude --environment main", "started agent", actor=story.agent)
    launcher.wait_for_requests()
    story.expect_rows(launcher.requests[0]["environment"] == "main")
