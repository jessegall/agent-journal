from engine.skill.skill_declaration import SkillDeclaration


class JournalLibrary(SkillDeclaration):
    """The skill journal-library: use the library to find, read, get and share a team's documents,
    sequences and checks."""

    folder = "journal-library"
    description = "Use the library to find, read, get and share a team's documents, sequences and checks; read it when a shared item is needed"
    keywords = ("library", "team", "shared")
    commands = ["library"]
