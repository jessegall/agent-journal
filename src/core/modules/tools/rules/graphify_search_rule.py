from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.journal.journal_home import JournalHome
from engine.enums.role_group import RoleGroup
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from engine.driver.search_category import CODE, SearchCategory
from engine.setting.setting_values import SettingValues
from core.modules.tools.support.tool_catalogue import GRAPHIFY
from core.modules.tools.support.tool_nudges import GRAPHIFY_FIRST, USE_GRAPHIFY
from core.modules.tools.models.enums.tool_setting import GRAPHIFY_BLOCK_AFTER, GRAPHIFY_NUDGE_AFTER

SCANNED_BLOCK_TOOL_USES = 3


class GraphifySearchRule(DriverRule):
    """While the Graphify tool is on, an agent's searches of the project's code that do not use Graphify are
    counted back to its last use of Graphify: from the nudge count on it is told to use Graphify, again ten
    searches later, and past the block count every search that is not Graphify is refused until it has used
    Graphify, which starts the count again."""

    name = "tools.graphify-search"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT
    refuses_one_action = "While the Graphify tool is on, an agent's searches of the project's code that do not use Graphify are counted"

    def __init__(self, hook_calls: HookCallQuery, settings: SettingValues, home: JournalHome) -> None:
        self.hook_calls, self.settings, self.home = hook_calls, settings, home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.uses_graphify or not tool.is_search or not self.settings.flag(GRAPHIFY.settings_key):
            return RuleAnswer.allowed()
        if SearchCategory.classify(tool, str(hook.event.raw.get("cwd", "")), self.home.project_folder) != CODE:
            return RuleAnswer.allowed()
        block_after = self.settings.number(GRAPHIFY_BLOCK_AFTER)
        searches = self.hook_calls.code_searches_after_graphify(hook.agent_id, block_after * SCANNED_BLOCK_TOOL_USES)
        if searches >= block_after:
            return RuleAnswer.refused(GRAPHIFY_FIRST.nudge(count=searches))
        if searches + 1 >= self.settings.number(GRAPHIFY_NUDGE_AFTER):
            return RuleAnswer.with_nudges(USE_GRAPHIFY.nudge(count=searches + 1))
        return RuleAnswer.allowed()
