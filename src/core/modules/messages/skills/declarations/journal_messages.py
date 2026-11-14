from engine.skill.skill_declaration import SkillDeclaration


class JournalMessages(SkillDeclaration):
    """The skill journal-messages: read and answer the user's messages and ask the user questions."""

    folder = "journal-messages"
    description = "Read and answer the user's messages and ask the user questions; read it before the first message command of a session"
    keywords = ("message", "reply", "question")
    commands = ("message", "question")
