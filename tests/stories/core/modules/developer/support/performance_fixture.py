from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, SLOW_TICKS_SETTING
import json

from engine.database.points import Points
from engine.module.performance_tools import PerformanceTools
from engine.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.developer_settings import TOOLS_SETTING
from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder


class DevelopmentToolsEnabled(StoryFixture):
    """A builder and a user with development cost reporting enabled: call costs and costly clock ticks."""

    parent = UserBuilder

    def steps(self, story) -> None:
        tools = story.container.get(PerformanceTools)
        tools.run(ReaderTimeTool, "vitest", 12)
        tools.run(RouteCostTool, "/cli", Points(rows=4))
        story.expect_rows(json.loads(story.run("developer numbers --json", actor=story.user).output_text)["rows"] == [])
        story.expect_success(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)
        story.expect_success(f"setting set {HOOK_DURATIONS_SETTING} true --project", actor=story.user)
        story.expect_success(f"setting set {SLOW_TICKS_SETTING} true --project", actor=story.user)
