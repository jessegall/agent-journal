from engine.enums.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.enums.mark_group import MarkGroup
from core.modules.skills.models.enums.skill_mark_type import SkillMarkType
from core.modules.skills.models.enums.skill_mark_variant import SkillMarkVariant

SKILLS_FAMILY = MarkFamily("skills.skills", "Skills", "skill", MarkGroup.AGENT)

SKILL_MARKS = [MarkDeclaration(SkillMarkType.SKILL, SkillMarkVariant, SKILLS_FAMILY, "Skill loaded", "skill", click=MarkClick.OPEN_ROW,
                               group_label="{count} skills loaded")]
