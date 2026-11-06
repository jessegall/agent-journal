from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.setting_requests.commands.request_setting.request_setting_handler import RequestSettingHandler
from core.modules.setting_requests.commands.request_setting.request_setting_subcommand import RequestSettingSubcommand
from core.modules.setting_requests.guards.request_question_guard import RequestQuestionGuard
from core.modules.setting_requests.listeners.approved_setting_listener import ApprovedSettingListener
from core.modules.setting_requests.migrations.m001_setting_requests import SettingRequestsTableMigration
from core.modules.setting_requests.models.setting_request import SettingRequest


class SettingRequestsModule(Module):
    """Lets a main agent ask a person to change a setting only a person may change, as a question in the chat."""

    name = "journal.core.setting-requests"
    requires_core = ">=5,<6"
    move_reason = "this table is new in version 5, so version 4 holds nothing to carry over"
    seed_reason = "the demo shows no setting requests"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.settings", "journal.core.questions"]
    models = [ModelDeclaration(SettingRequest, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [SettingRequestsTableMigration]
    handlers = [RequestSettingHandler]
    subcommands = [RequestSettingSubcommand]
    guards = [RequestQuestionGuard]
    listeners = [ApprovedSettingListener]
