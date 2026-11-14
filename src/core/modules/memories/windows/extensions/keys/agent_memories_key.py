from engine.enums.key_loading import KeyLoading
from engine.viewer.window_key import WindowKey


class AgentMemoriesKey(WindowKey):
    """The active memories of one agent, by its id, heaviest first, read when asked."""

    name = "agent-memories.*"
    read = "memory page --agent {id} --state active --order weight --limit 100"
    tab = "memories"
    events = ["memory.*"]
    loading = KeyLoading.REQUESTED
