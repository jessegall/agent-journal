from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.type_guards import is_list, is_mapping
from suites.coding.modules.workers.commands.record_todo_list import RecordTodoList
from suites.coding.modules.workers.models.enums.todo_state import TodoState

TODO_TOOL = "TodoWrite"


class RecordTodoListRule(DriverRule):
    """Each to-do list an agent program writes is kept as its to-do items, for the to-do list window."""

    name = "workers.record-todo-list"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["coding.*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        tool_input = hook.event.raw.get("tool_input")
        todos = tool_input.get("todos") if tool is not None and tool.name == TODO_TOOL and is_mapping(tool_input) else None
        if not is_list(todos):
            return RuleAnswer.allowed()
        states = {state.value: state for state in TodoState}
        items = tuple((str(todo.get("content", "")), states.get(str(todo.get("status")), TodoState.PENDING)) for todo in todos if is_mapping(todo))
        return RuleAnswer.allowed().running(RecordTodoList(hook.agent_id, items))
