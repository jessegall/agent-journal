from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.type_guards import is_mapping
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.bind_subagent_dispatch.bind_subagent_dispatch import BindSubagentDispatch
from core.modules.drivers.commands.record_subagent_dispatch.record_subagent_dispatch import RecordSubagentDispatch
from core.modules.drivers.models.helper_job import HelperJob

DEFAULT_PROFILE = "subagent"
BACKGROUND_INPUT = "run_in_background"
ASYNC_RESPONSE = "isAsync"
RETURNED_FIELD = "last_assistant_message"


class DispatchMarkRule(DriverRule):
    """Keeps each subagent dispatch when the dispatch tool is called, and what it returned when it ends: at the
    tool's end for one the agent waits on, at the subagent's stop for one in the background."""

    name = "drivers.dispatch-record"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, queries: Queries, agents: AgentRows) -> None:
        self.queries, self.agents = queries, agents

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.role == AgentRole.SUBAGENT and hook.event.event is HookEventName.SESSION_START:
            return self.subagent_started(hook)
        if hook.role == AgentRole.SUBAGENT:
            return self.subagent_stopped(hook) if hook.event.event is HookEventName.STOP else RuleAnswer.allowed()
        tool = hook.event.tool
        if tool is None or tool.category is not ToolType.AGENT:
            return RuleAnswer.allowed()
        dispatch = hook.event.tool_input()
        key, profile = f"{hook.event.raw.get('tool_use_id', hook.event.firing)}", f"{dispatch.get('subagent_type') or DEFAULT_PROFILE}"
        model, description, instruction = f"{dispatch.get('model', '')}", f"{dispatch.get('description', '')}", f"{dispatch.get('prompt', '')}"
        if hook.event.event is HookEventName.PRE_TOOL_USE:
            return RuleAnswer.allowed().running(RecordSubagentDispatch(hook.environment_id, hook.agent_id, key, profile, model, description, instruction))
        if hook.event.event is HookEventName.POST_TOOL_USE and not self.is_background_launch(hook):
            return RuleAnswer.allowed().running(RecordSubagentDispatch(hook.environment_id, hook.agent_id, key, profile, model, description, instruction, f"{hook.event.raw.get('tool_response', '')}", True))
        return RuleAnswer.allowed()

    @staticmethod
    def is_background_launch(hook: AgentHook) -> bool:
        response = hook.event.raw.get("tool_response")
        return bool(hook.event.tool_input().get(BACKGROUND_INPUT)) or (is_mapping(response) and response.get(ASYNC_RESPONSE) is True)

    def subagent_started(self, hook: AgentHook) -> RuleAnswer:
        parent = self.agents.find(hook.agent_id).parent_id
        if parent is None:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(BindSubagentDispatch(parent, f"{hook.event.raw.get('agent_type') or DEFAULT_PROFILE}", hook.agent_id))

    def subagent_stopped(self, hook: AgentHook) -> RuleAnswer:
        parent = self.agents.find(hook.agent_id).parent_id
        raw = hook.event.raw
        profile = f"{raw.get('agent_type') or DEFAULT_PROFILE}"
        rows = self.queries.query(HelperJob).filter(agent_id=parent, profile=profile).matching(IsNull("ended_at")).oldest().limited(1) if parent is not None else ()
        if not rows or parent is None:
            return RuleAnswer.allowed()
        row = rows[0]
        return RuleAnswer.allowed().running(RecordSubagentDispatch(row.environment_id, parent, row.tool_key, row.profile, row.program_model, row.description, row.instruction, f"{hook.event.raw.get(RETURNED_FIELD, '')}", True))
