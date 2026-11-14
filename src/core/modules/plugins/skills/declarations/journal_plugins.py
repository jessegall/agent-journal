from engine.skill.skill_declaration import SkillDeclaration


class JournalPlugins(SkillDeclaration):
    """The skill journal-plugins: see what plugins do, install and upgrade them or propose one to the user."""

    folder = "journal-plugins"
    description = "See what plugins do, install and upgrade them or propose one to the user; read it before the first plugin command of a session"
    keywords = ("plugin", "plugins")
    commands = ["plugin"]
