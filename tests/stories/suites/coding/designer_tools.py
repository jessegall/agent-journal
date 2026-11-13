from engine.enums.tool_type import ToolType
from engine.testing.expectations.expect_reply import expect_reply_allowed
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.modules.drivers.support.access_nudges import LIMITED_TOOL
from engine.testing.expectations.said_nudge import said
from suites.coding.support.coding_settings import DESIGNER_ENABLED_SETTING
from suites.coding.support.shipped_profiles import DESIGNER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

CLAUDE_DESIGN_TOOL = "mcp__claude_design__write_files"


class StartedDesigner(StoryFixture):
    f"""A main agent with a user beside it and one {DESIGNER_PROFILE.name} helper."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success(f"setting set {DESIGNER_ENABLED_SETTING} true --project", actor=story.user)
        launcher = FakeLauncher.listening(story.home.socket("launcher"))
        story.expect_success(f'helper start {DESIGNER_PROFILE.name} --brief "Design the settings page" --environment main', actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()


class StartedResearcher(StoryFixture):
    f"""A main agent with a user beside it and one read-only {RESEARCHER_PROFILE.name} helper."""

    parent = UserBuilder

    def steps(self, story):
        launcher = FakeLauncher.listening(story.home.socket("launcher"))
        story.run(f'helper start {RESEARCHER_PROFILE.name} --brief "Read src/cart.py" --environment main', actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()


def claude_design_call():
    return HookSamples.tool_use(CLAUDE_DESIGN_TOOL, ToolType.UNCATEGORISED, [], None)


def test_a_designer_helper_calls_the_claude_design_tools(new_story):
    story = new_story(fixture=StartedDesigner)
    expect_reply_allowed(story.hook(helper_agent(story).session, claude_design_call()))


def test_another_read_only_helper_is_still_refused_the_claude_design_tools(new_story):
    story = new_story(fixture=StartedResearcher)
    story.expect_hook_refusal(helper_agent(story).session, claude_design_call(), said(LIMITED_TOOL))
