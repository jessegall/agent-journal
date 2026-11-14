from engine.skill.skill_declaration import SkillDeclaration


class JournalShell(SkillDeclaration):
    """The skill journal-shell: run shell commands through the journal and read what they printed."""

    folder = "journal-shell"
    description = "Run shell commands through the journal and read what they printed; read it before reading an output, or writing a reader or an alias"
    keywords = ("output", "reader", "alias")
