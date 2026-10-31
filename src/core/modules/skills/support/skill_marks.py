from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.modules.skills.models.enums.skill_mark_type import SkillMarkType
from core.modules.skills.models.enums.skill_mark_variant import SkillMarkVariant

SKILLS_FAMILY = MarkFamily("skills.skills", "Skills", "skill", MarkGroup.AGENT)

SKILL_MARKS = [MarkDeclaration(SkillMarkType.SKILL, SkillMarkVariant, SKILLS_FAMILY, "Skill loaded", "skill", click=MarkClick.NONE,
                               group_label="{count} skills loaded")]
