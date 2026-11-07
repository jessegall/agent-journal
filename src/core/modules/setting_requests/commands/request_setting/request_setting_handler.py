from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.command.request_user_approval import RequestUserApproval
from core.base.user_approval import UserApproval
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.setting_requests.commands.request_setting.request_setting import RequestSetting
from core.modules.settings.commands.set_setting.set_setting_handler import SetSettingHandler
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.setting_revision import SettingRevision
from core.modules.settings.support.setting_text import SettingText

APPROVE_OPTION = "Yes, approve"
REFUSE_OPTION = "No"


class RequestSettingHandler(Handler[RequestSetting, ApprovalRequest]):
    """Checks a proposed setting change and sends it through the shared approval dock."""

    command = RequestSetting

    def __init__(self, declared: SettingCatalogue, values: SettingReader, bus: Bus, revision: SettingRevision) -> None:
        self.declared, self.values, self.bus, self.revision = declared, values, bus, revision

    def handle(self, command: RequestSetting, context: Context) -> ApprovalRequest:
        if context.actor.type is not ActorType.AGENT:
            raise Refusal("only an agent asks for a setting", "change the setting on the Settings page")
        entry = self.declared.value(command.key)
        if not entry.person_set:
            raise Refusal(f"an agent may set {command.key} itself", "journal setting set")
        if not command.reason.strip():
            raise Refusal("say why the setting should change", "--reason '<why>'")
        value = SettingText().value(entry, command.text)
        SetSettingHandler.environment(entry, command.project, context.environment_id)
        details = f"{entry.title} ({entry.key}) would change from {self.values.current(entry.key).value} to {value}. Reason: {command.reason.strip()}"
        arguments = ("setting", "set", entry.key, command.text)
        if command.project:
            arguments = (*arguments, "--project")
        arguments = (*arguments, "--expected-revision", self.revision.current(entry.key))
        return self.bus.dispatch(RequestUserApproval(UserApproval(f"Change {entry.title}?\n{details}"), arguments), context)
