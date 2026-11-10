from core.modules.skills.support.main_agent_skills import MainAgentSkills


class StoryMainAgentSkills(MainAgentSkills):
    """A story that is not about a main agent's skills does not load them."""

    is_required = False
