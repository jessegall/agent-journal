from engine.skill.skill_declaration import SkillDeclaration


class JournalEtiquette(SkillDeclaration):
    """The skill journal-etiquette: behave in the chat with the user and keep the journal's own mechanics out of it."""

    folder = "journal-etiquette"
    description = "Behave in the chat with the user and keep the journal's own mechanics out of it; read it before your first reply of every session, with the journal skill"
    types = ["main"]
