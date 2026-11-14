from engine.skill.skill_declaration import SkillDeclaration


class JournalTasks(SkillDeclaration):
    """The skill journal-tasks: use tasks to declare, log and finish the current work."""

    folder = "journal-tasks"
    description = "Use tasks to declare, log and finish the current work; read it before the first task command of a session"
    keywords = ("task", "tasks", "todo")
    commands = ["task"]
