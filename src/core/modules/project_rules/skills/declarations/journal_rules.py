from engine.skill.skill_declaration import SkillDeclaration


class JournalRules(SkillDeclaration):
    """The skill journal-rules: declare project rules, the standing instructions every agent gets at its start."""

    folder = "journal-rules"
    description = "Declare project rules, the standing instructions every agent gets at its start; read it before the first rule command of a session"
    keywords = ("rule", "rules")
    commands = ["rule"]
