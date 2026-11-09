import json

from core.base.database.points import Points
from core.base.module.performance_tools import PerformanceTools
from core.base.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.developer_settings import TOOLS_SETTING
from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder


class DevelopmentToolsEnabled(StoryFixture):
    """A builder and a person with development cost reporting enabled."""

    parent = UserBuilder

    def steps(self, story) -> None:
        tools = story.container.get(PerformanceTools)
        tools.run(ReaderTimeTool, "vitest", 12)
        tools.run(RouteCostTool, "/cli", Points(rows=4))
        story.expect_rows(json.loads(story.run("developer numbers --json", actor=story.user).output_text)["rows"] == [])
        story.expect_success(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)
