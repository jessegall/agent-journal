from engine.command.command import Command
from collections.abc import Sequence
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.enums.hook_event_name import HookEventName
from engine.types.type_guards import is_list, is_mapping
from suites.coding.modules.workers.commands.record_todo_list.record_todo_list import RecordTodoList
from suites.coding.modules.workers.models.enums.todo_state import TodoState

TODO_TOOL = "TodoWrite"


class RecordTodoListEffect(EventEffect):
    """Each to-do list an agent program writes is kept as its to-do items, for the to-do list window."""

    key = "workers.record-todo-list"
    events = [HookEventName.POST_TOOL_USE]

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        tool = event.tool
        tool_input = event.raw.get("tool_input")
        todos = tool_input.get("todos") if tool is not None and tool.name == TODO_TOOL and is_mapping(tool_input) else None
        if not is_list(todos):
            return []
        states = {state.value: state for state in TodoState}
        items = tuple((str(todo.get("content", "")), states.get(str(todo.get("status")), TodoState.PENDING)) for todo in todos if is_mapping(todo))
        return [RecordTodoList(agent_id, items)]
