from core.modules.skills.support.skill_requirement import SkillRequirement


class StorySkillRequirement(SkillRequirement):
    """A story that is not about skills does not read them first."""

    is_required = False
