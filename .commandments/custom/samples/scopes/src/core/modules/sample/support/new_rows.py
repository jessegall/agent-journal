from core.modules.tasks.models.task import Task
from core.modules.questions.models.question import Question


def make_environment_task():
    # @sin architecture_scopes_scope_id_set_on_a_new_row
    return Task(environment_id=1, creator_id=1, title="Work")


def make_agent_question():
    # @sin architecture_scopes_scope_id_set_on_a_new_row
    # @sin architecture_questions_question_made_outside_the_ask_handler
    return Question(agent_id=1, creator_id=1, text="Which database?")


def make_scoped_task():
    # @righteous architecture_scopes_scope_id_set_on_a_new_row
    return Task(creator_id=1, title="Work")
