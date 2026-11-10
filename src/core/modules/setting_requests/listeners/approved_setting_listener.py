from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.logged_event import LoggedEvent
from engine.change.moved import Moved
from engine.command.bus import Bus
from engine.command.close_user_approval import CloseUserApproval
from core.base.module.module_actors import ModuleActors
from core.base.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.questions.models.question import Question
from core.modules.setting_requests.commands.request_setting.request_setting_handler import APPROVE_OPTION
from core.modules.setting_requests.models.setting_request import SettingRequest
from core.modules.settings.commands.set_setting.set_setting import SetSetting


class ApprovedSettingListener(CommitListener[Moved[Question]]):
    """Applies a requested setting once a person approves its question, with that person as the actor."""

    name = "setting-requests.approved"
    moves = (QuestionLifecycle.answer, QuestionLifecycle.close)

    def __init__(self, queries: Queries, bus: Bus, actors: ModuleActors) -> None:
        self.queries, self.bus = queries, bus
        self.actors = actors

    def handle(self, event: Moved[Question], logged: LoggedEvent) -> None:
        request = self.queries.query(SettingRequest).filter(question_id=event.row.id).first()
        if request is None:
            return
        if event.move is not None and event.move.name == QuestionLifecycle.answer.name and event.row.answer == APPROVE_OPTION:
            self.bus.run(SetSetting(request.key, request.value, request.project), Actor(logged.actor_id, ActorType.USER), cause_id=logged.id, environment_id=request.environment_id)
        arguments = ("question", "answer", str(event.row.id), "--answer", APPROVE_OPTION)
        self.bus.run(CloseUserApproval(arguments), self.actors.actor("journal.core.setting-requests"),
                     cause_id=logged.id, environment_id=request.environment_id)
