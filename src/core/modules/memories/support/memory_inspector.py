from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.text_field import TextField
from core.modules.memories.models.enums.memory_state import MemoryState
from core.modules.memories.models.memory import Memory

MEMORY_INSPECTOR = InspectorDeclaration(
    Memory,
    reads="memory show {row_id}",
    label="Memory {id} · {state}",
    title="{title}",
    events=("memory.*",),
    actions=(
        ButtonDeclaration("memories.remove", (), "Remove the memory", "memory remove {row_id} --reason={reason}", icon="stop",
                          condition=ButtonCondition("state", (MemoryState.ACTIVE.value,)),
                          fields=(TextField("reason", "Why is it removed?"),)),
        ButtonDeclaration("memories.restore", (), "Restore the memory", "memory restore {row_id}", icon="restore", primary=True,
                          condition=ButtonCondition("state", (MemoryState.REMOVED.value,))),
    ),
    components=(InspectorComponent("memories.memory-facts"),),
)
