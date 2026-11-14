from engine.skill.skill_declaration import SkillDeclaration


class JournalDocuments(SkillDeclaration):
    """The skill journal-documents: write lasting knowledge as documents and what was checked as reports."""

    folder = "journal-documents"
    description = "Write lasting knowledge as documents and what was checked as reports; read it before the first doc or report command of a session"
    keywords = ("document", "documents", "report")
    commands = ("doc", "report")
