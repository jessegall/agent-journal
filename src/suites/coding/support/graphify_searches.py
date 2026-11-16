
from engine.driver.hook_event import HookEvent
from engine.driver.search_category import CODE, GRAPHIFY as GRAPHIFY_SEARCH, SearchCategory
from engine.enums.hook_event_name import HookEventName
from engine.journal.journal_home import JournalHome
from engine.request.request_values import RequestValues
from engine.setting.setting_values import SettingValues
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from suites.coding.agent_messages.graphify_first_message import GraphifyFirstMessage
from suites.coding.agent_messages.use_graphify_message import UseGraphifyMessage
from suites.coding.support.graphify_settings import GRAPHIFY_BLOCK_AFTER, GRAPHIFY_AGENT_MESSAGE_AFTER
from suites.coding.support.graphify_tool import GRAPHIFY

from suites.coding.support.graphify_answer import GraphifyAnswer
SCANNED_BLOCK_TOOL_USES = 3
GRAPHIFY_SEARCH_KEY = "tools.graphify-search"


class GraphifySearches:
    """While the Graphify tool is on, an agent's searches of the project's code that do not use Graphify are
    counted back to its last use of Graphify: from the agent message count on it is told to use Graphify,
    again ten searches later, and past the block count every search that is not Graphify is refused until it
    has used Graphify, which starts the count again. Read once a hook, so the refusal and the line agree."""

    def __init__(self, hook_calls: HookCallQuery, settings: SettingValues, home: JournalHome, request_values: RequestValues) -> None:
        self.hook_calls, self.settings, self.home, self.request_values = hook_calls, settings, home, request_values

    def answer(self, event: HookEvent, agent_id: int) -> GraphifyAnswer:
        return self.request_values.read(f"coding.graphify:{agent_id}:{event.event_id}", lambda: event.event_id, lambda: self.counted(event, agent_id))

    def counted(self, event: HookEvent, agent_id: int) -> GraphifyAnswer:
        tool = event.tool
        if tool is None or tool.uses_graphify or not tool.is_search or not self.settings.flag(GRAPHIFY.settings_key):
            return GraphifyAnswer()
        if SearchCategory.classify(tool, str(event.raw.get("cwd", "")), self.home.project_folder) != CODE:
            return GraphifyAnswer()
        block_after = self.settings.number(GRAPHIFY_BLOCK_AFTER)
        searches = self.code_searches_after_graphify(agent_id, block_after * SCANNED_BLOCK_TOOL_USES)
        if searches >= block_after:
            return GraphifyAnswer(refusal=GraphifyFirstMessage.declared().agent_message(count=searches))
        if searches + 1 >= self.settings.number(GRAPHIFY_AGENT_MESSAGE_AFTER):
            return GraphifyAnswer(agent_message=UseGraphifyMessage.declared().agent_message(count=searches + 1))
        return GraphifyAnswer()

    # The searches of the code among the agent's newest tool uses since its last use of Graphify.
    def code_searches_after_graphify(self, agent_id: int, tool_uses: int) -> int:
        count = 0
        for call in self.hook_calls.newest_calls(agent_id, HookEventName.PRE_TOOL_USE, tool_uses):
            if call.search_category == GRAPHIFY_SEARCH:
                break
            count += call.search_category == CODE
        return count
