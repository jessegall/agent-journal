from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.helpers.commands.answer_steer.answer_steer import AnswerSteer
from core.modules.helpers.models.helper_steer import HelperSteer


class AnswerSteerHandler(Handler[AnswerSteer, HelperSteer]):
    """Saves a helper's answer to a steer added to its own job."""

    command = AnswerSteer

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: AnswerSteer, context: Context) -> HelperSteer:
        steer = self.queries.query(HelperSteer).find(command.steer_id)
        if steer.helper_id != context.actor.id:
            raise Refusal(f"helper-steer:{steer.id} was added to another helper's job", "only that helper answers it")
        if not command.answer.strip():
            raise Refusal("an answer to a steer describes what you change in your work", f'journal helper answer-steer {steer.id} "<what you change in your work>"')
        return self.repository.save(steer.answered(command.answer.strip()), context)
