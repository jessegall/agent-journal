from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class AgentSkillKey(WindowKey):
    """The agent-skill.* data of the skills.skill-body window."""

    name = "agent-skill.*"
    read = "agent-skill show {id}"
    loading = KeyLoading.REQUESTED
