from engine.skill.skill_declaration import SkillDeclaration


class JournalTaskCleanup(SkillDeclaration):
    """The skill journal-task-cleanup: follow the steps that sort the open tasks in no plan into covered, duplicate and still valid ones."""

    folder = "journal-task-cleanup"
    description = "Follow the steps that sort the open tasks in no plan into covered, duplicate and still valid ones; read it when you are asked to clean up, group or cancel loose tasks"
