from engine.skill.skill_declaration import SkillDeclaration
from suites.coding.support.coding_settings import PLAIN_NAMES_SETTING


class JournalPlainCodeNaming(SkillDeclaration):
    """The skill journal-plain-code-words: use plain words for every variable, method, class and file, by a ladder."""

    folder = "journal-plain-code-words"
    description = "Use plain words for every variable, method, class and file, by a ladder; read it before you name anything"
    keywords = ("naming", "rename")
    required_setting = PLAIN_NAMES_SETTING
