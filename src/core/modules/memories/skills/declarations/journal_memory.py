from engine.skill.skill_declaration import SkillDeclaration


class JournalMemory(SkillDeclaration):
    """The skill journal-memory: keep what matters beyond the context window with weighted memories."""

    folder = "journal-memory"
    description = "Keep what matters beyond the context window with weighted memories; read it before the first memory command of a session, or when the context reaches a mark"
    keywords = ("memory", "memories", "remember")
    commands = ["memory"]
