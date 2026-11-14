from engine.viewer.button_condition import ButtonCondition
from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.inspector_component import InspectorComponent
from engine.viewer.inspector_declaration import InspectorDeclaration
from engine.viewer.text_field import TextField
from core.modules.memories.models.enums.memory_state import MemoryState
from core.modules.memories.models.memory import Memory

MEMORY_INSPECTOR = InspectorDeclaration(
    Memory,
    reads="memory show {row_id}",
    label="Memory {id} · {state}",
    title="{title}",
    events=tuple(["memory.*"]),
    actions=(
        ButtonDeclaration("memories.remove", (), "Remove the memory", "memory remove {row_id} --reason={reason}", icon="stop",
                          condition=ButtonCondition("state", tuple([MemoryState.ACTIVE.value])),
                          fields=tuple([TextField("reason", "Why is it removed?")])),
        ButtonDeclaration("memories.restore", (), "Restore the memory", "memory restore {row_id}", icon="restore", primary=True,
                          condition=ButtonCondition("state", tuple([MemoryState.REMOVED.value]))),
    ),
    components=tuple([InspectorComponent("memories.memory-facts")]),
    lists_fields=True,
)
