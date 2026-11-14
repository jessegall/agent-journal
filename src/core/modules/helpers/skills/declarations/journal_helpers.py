from engine.skill.skill_declaration import SkillDeclaration


class JournalHelpers(SkillDeclaration):
    """The skill journal-helpers: start a helper for a bounded read, send it more, stop it, and read its report."""

    folder = "journal-helpers"
    description = "Start a helper for a bounded read, send it more, stop it, and read its report; read it before the first helper command of a session"
    keywords = ["helper start"]
