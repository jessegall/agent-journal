from engine.skill.skill_declaration import SkillDeclaration


class JournalTemplates(SkillDeclaration):
    """The skill journal-templates: find and use a template for a task, a plan or a review."""

    folder = "journal-templates"
    description = "Find and use a template for a task, a plan or a review; read it before the first template command of a session"
    keywords = ("template", "templates")
    commands = ["template"]
