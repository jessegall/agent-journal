from engine.viewer.window_extension import WindowExtension
from engine.viewer.window_tab import WindowTab
from core.modules.memories.windows.extensions.keys.agent_memories_key import AgentMemoriesKey
from core.modules.memories.windows.extensions.keys.agent_removed_memories_key import AgentRemovedMemoriesKey


class AgentMemoriesTabsExtension(WindowExtension):
    """The memories tab an agent list gets for each agent; the agents and the helpers list each extend their window
    with it."""

    reads = ["memory page"]
    runs = ["memory weigh", "memory edit", "memory remove", "memory restore"]
    events = ["memory.*"]
    keys = [AgentMemoriesKey, AgentRemovedMemoriesKey]
    tabs = [WindowTab("memories", "Memories", "memory page", count_field="memories", component="/modules/journal.core.memories/agent-memories.js")]
