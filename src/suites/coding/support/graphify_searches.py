from dataclasses import dataclass

from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.driver.search_category import CODE, GRAPHIFY as GRAPHIFY_SEARCH, SearchCategory
from engine.enums.hook_event_name import HookEventName
from engine.journal.journal_home import JournalHome
from engine.request.request_values import RequestValues
from engine.setting.setting_values import SettingValues
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from suites.coding.nudges.graphify_first_nudge import GraphifyFirstNudge
from suites.coding.nudges.use_graphify_nudge import UseGraphifyNudge
from suites.coding.support.graphify_settings import GRAPHIFY_BLOCK_AFTER, GRAPHIFY_NUDGE_AFTER
from suites.coding.support.graphify_tool import GRAPHIFY

SCANNED_BLOCK_TOOL_USES = 3
GRAPHIFY_SEARCH_KEY = "tools.graphify-search"


@dataclass(frozen=True)
class GraphifyAnswer:
    """What a search of the code that does not use Graphify gets: a refusal past the block count, or a line from the
    nudge count on."""

    refusal: Nudge | None = None
    nudge: Nudge | None = None


class GraphifySearches:
    """While the Graphify tool is on, an agent's searches of the project's code that do not use Graphify are counted
    back to its last use of Graphify: from the nudge count on it is told to use Graphify, again ten searches later,
    and past the block count every search that is not Graphify is refused until it has used Graphify, which starts the
    count again. Read once a hook, so the refusal and the line agree."""

    def __init__(self, hook_calls: HookCallQuery, settings: SettingValues, home: JournalHome, request_values: RequestValues) -> None:
        self.hook_calls, self.settings, self.home, self.request_values = hook_calls, settings, home, request_values

    def answer(self, event: HookEvent, agent_id: int) -> GraphifyAnswer:
        return self.request_values.read(f"coding.graphify:{agent_id}:{event.firing}", lambda: event.firing, lambda: self.counted(event, agent_id))

    def counted(self, event: HookEvent, agent_id: int) -> GraphifyAnswer:
        tool = event.tool
        if tool is None or tool.uses_graphify or not tool.is_search or not self.settings.flag(GRAPHIFY.settings_key):
            return GraphifyAnswer()
        if SearchCategory.classify(tool, str(event.raw.get("cwd", "")), self.home.project_folder) != CODE:
            return GraphifyAnswer()
        block_after = self.settings.number(GRAPHIFY_BLOCK_AFTER)
        searches = self.code_searches_after_graphify(agent_id, block_after * SCANNED_BLOCK_TOOL_USES)
        if searches >= block_after:
            return GraphifyAnswer(refusal=GraphifyFirstNudge.declared().nudge(count=searches))
        if searches + 1 >= self.settings.number(GRAPHIFY_NUDGE_AFTER):
            return GraphifyAnswer(nudge=UseGraphifyNudge.declared().nudge(count=searches + 1))
        return GraphifyAnswer()

    # The searches of the code among the agent's newest tool uses since its last use of Graphify.
    def code_searches_after_graphify(self, agent_id: int, tool_uses: int) -> int:
        count = 0
        for call in self.hook_calls.newest_calls(agent_id, HookEventName.PRE_TOOL_USE, tool_uses):
            if call.search_category == GRAPHIFY_SEARCH:
                break
            count += call.search_category == CODE
        return count
