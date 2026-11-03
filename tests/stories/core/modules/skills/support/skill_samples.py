from core.base.module.module import Module
from core.base.skill.skill_declaration import SkillDeclaration

PATH = "tests.stories.core.modules.skills.support.skill_samples"
DEPENDENCIES = ["journal.core.tasks"]

NOTES = SkillDeclaration("journal-notes", "How to take notes", keywords=["note"], commands=["task list"], events=["task.*"])
TASKS = SkillDeclaration("journal-chores", "How to work a task", keywords=["task"], commands=["chore start"], events=["task.start"])


class GoodSkillsModule(Module):
    name = "goodskills"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    skills = [NOTES, TASKS]


class TwiceSkillsModule(Module):
    name = "twiceskills"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    skills = [NOTES, NOTES]


class OutsideNameModule(Module):
    name = "outsideskills"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    skills = [SkillDeclaration("notes", "How to take notes")]


class MissingFileModule(Module):
    name = "missingskills"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    skills = [SkillDeclaration("journal-absent", "A skill with no file")]


class GhostEventModule(Module):
    name = "ghostskills"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    skills = [SkillDeclaration("journal-notes", "How to take notes", events=["ghost.*"])]


class PlanSkillsModule(Module):
    name = "planskills"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    skills = [SkillDeclaration("journal-roadmaps", "How to follow a plan", keywords=["plan"])]


class DueSkillsModule(Module):
    name = "dueskills"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    skills = [SkillDeclaration("journal-notes", "How to take notes", keywords=["note"], commands=["note"]),
              SkillDeclaration("journal-chores", "How to work a task", keywords=["tasks"], commands=["chore"], events=["task.start"])]


class LongPathSkillsModule(Module):
    name = "longpathskills"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    skills = [SkillDeclaration("journal-commandments-plain-code-words-and-the-architecture-of-process-reader-requests",
                               "How to write process reader requests")]
