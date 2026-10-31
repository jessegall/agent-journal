from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.questions.migrations.m001_questions import QuestionsTablesMigration
from core.modules.questions.models.question import Question


class QuestionsModule(Module):
    """Adds questions an agent asks the user, with the options it offers and the answer it gets."""

    name = "journal.core.questions"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = (ModelDeclaration(Question),)
    migrations = [QuestionsTablesMigration]
