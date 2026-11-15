from engine.viewer.window_key import WindowKey


class AgentMessagesKey(WindowKey):
    """The agent messages data of the drivers.agent-messages window."""

    name = "agent_messages"
    read = "agent-message list"
    events = ["agent_message_record.*"]
