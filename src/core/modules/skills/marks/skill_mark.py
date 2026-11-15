from engine.chat.mark_declaration import MarkDeclaration
from engine.enums.mark_click import MarkClick
from core.modules.skills.models.enums.skill_mark_type import SkillMarkType
from core.modules.skills.models.enums.skill_mark_variant import SkillMarkVariant
from core.modules.skills.support.skill_marks import SKILLS_FAMILY


class SkillMark(MarkDeclaration):
    """The mark SkillMarkType.SKILL."""

    type = SkillMarkType.SKILL
    variants = SkillMarkVariant
    family = SKILLS_FAMILY
    label = "Skill loaded"
    mark_icon = "skill"
    click = MarkClick.OPEN_ROW
    group_label = "{count} skills loaded"
