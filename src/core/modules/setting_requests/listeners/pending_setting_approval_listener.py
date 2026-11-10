from engine.event.logged_event import LoggedEvent
from engine.event.registry_synced import RegistrySynced
from engine.command.bus import Bus
from engine.command.request_user_approval import RequestUserApproval
from engine.listener.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.setting_requests.commands.request_setting.request_setting_handler import APPROVE_OPTION, REFUSE_OPTION
from core.modules.setting_requests.models.setting_request import SettingRequest


class PendingSettingApprovalListener(CommitListener[RegistrySynced]):
    """Moves existing unanswered setting questions into the shared approval dock after an upgrade."""

    name = "setting-requests.restore-approval"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: RegistrySynced, logged: LoggedEvent) -> None:
        requests = tuple(self.queries.query(SettingRequest).all_rows())
        questions = {question.id: question for question in self.queries.query(Question).find_many([request.question_id for request in requests])}
        pending = tuple(request for request in requests if questions[request.question_id].state is QuestionState.OPEN)
        for request in pending:
            question = questions[request.question_id]
            arguments = ("question", "answer", str(question.id), "--answer", APPROVE_OPTION)
            refused = ("question", "answer", str(question.id), "--answer", REFUSE_OPTION)
            approval = UserApprovalRefusal(question.text, arguments, refused, source_version=question.version, why=question.context or "An agent asked this before the upgrade and has not had an answer.")
            self.bus.run(RequestUserApproval(approval, arguments, request.creator_id), self.actors.actor("journal.core.setting-requests"),
                         cause_id=logged.id, environment_id=request.environment_id)
