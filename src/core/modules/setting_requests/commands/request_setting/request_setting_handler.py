from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.questions.commands.ask_question.ask_question import AskQuestion
from core.modules.setting_requests.commands.request_setting.request_setting import RequestSetting
from core.modules.setting_requests.models.setting_request import SettingRequest
from core.modules.settings.commands.set_setting.set_setting_handler import SetSettingHandler
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.setting_text import SettingText

APPROVE_OPTION = "Yes, approve"
REFUSE_OPTION = "No"


class RequestSettingHandler(Handler[RequestSetting, SettingRequest]):
    """Checks the change could be made, then asks it as a question with the setting, its old and new value and the
    reason, and keeps the request beside the question."""

    command = RequestSetting

    def __init__(self, declared: SettingCatalogue, values: SettingReader, repository: Repository, bus: Bus) -> None:
        self.declared, self.values, self.repository, self.bus = declared, values, repository, bus

    def handle(self, command: RequestSetting, context: Context) -> SettingRequest:
        if context.actor.type is not ActorType.AGENT:
            raise Refusal("only an agent asks for a setting", "a person sets it with journal setting set")
        entry = self.declared.value(command.key)
        if not entry.person_set:
            raise Refusal(f"an agent may set {command.key} itself", "journal setting set")
        if not command.reason.strip():
            raise Refusal("say why the setting should change", "--reason '<why>'")
        value = SettingText().value(entry, command.text)
        SetSettingHandler.environment(entry, command.project, context.environment_id)
        details = f"{entry.title} ({entry.key}) would change from {self.values.current(entry.key).value} to {value}. Reason: {command.reason.strip()}"
        question = self.bus.dispatch(AskQuestion(f"Change {entry.title}?", details, (APPROVE_OPTION, REFUSE_OPTION)), context)
        return self.repository.save(SettingRequest(creator_id=context.actor.id, question_id=question.id, key=entry.key, value=command.text, project=command.project), context)
