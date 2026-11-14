from engine.skill.skill_declaration import SkillDeclaration


class JournalDumps(SkillDeclaration):
    """The skill journal-dumps: file what the user dropped in a dump by sorting the material by subject
    into separate entries."""

    folder = "journal-dumps"
    description = "File what the user dropped in a dump by sorting the material by subject into separate entries; read it when a dump arrives"
    keywords = ("dump", "dumps", "dumped")
    commands = ["dump"]
    types = ["main"]
