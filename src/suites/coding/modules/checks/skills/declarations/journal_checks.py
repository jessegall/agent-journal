from engine.skill.skill_declaration import SkillDeclaration


class JournalChecks(SkillDeclaration):
    """The skill journal-checks: write and run scripts that pass or fail about the project."""

    folder = "journal-checks"
    description = "Write and run scripts that pass or fail about the project; read it when a check is made, run or fails"
    keywords = ("check", "checks")
    commands = ["check"]
