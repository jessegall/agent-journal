from core.modules.phone.declarations.phone_dependencies import PHONE_DEPENDENCIES
from core.modules.phone.declarations.phone_migrations import PHONE_MIGRATIONS
from core.modules.phone.declarations.phone_subcommands import PHONE_SUBCOMMANDS
from core.modules.phone.declarations.phone_handlers import PHONE_HANDLERS
from core.modules.phone.windows.phone_windows import PHONE_WINDOWS
from core.modules.phone.models.declarations.phone_model_declaration import PhoneModelDeclaration
from core.modules.phone.models.declarations.phone_code_model_declaration import PhoneCodeModelDeclaration
from core.modules.phone.settings.phone_setting_values import PhoneSettingValues
from engine.module.module import Module
from core.modules.phone.guards.phone_row_guard import PhoneRowGuard
from core.modules.phone.guards.phone_code_row_guard import PhoneCodeRowGuard
from core.modules.phone.upgrade.phone_move import PhoneMove
from core.modules.phone.seeders.phone_seeder import PhoneSeeder
from core.modules.phone.listeners.plan_notice_listener import PlanNoticeListener
from core.modules.phone.listeners.question_notice_listener import QuestionNoticeListener
from core.modules.phone.support.push_service import PushService
from core.modules.phone.support.push_transport import PushTransport
from core.modules.phone.push.web_push import WebPush
from core.modules.phone.tick_handlers.phone_notices_tick_handler import PhoneNoticesTickHandler


class PhoneModule(Module):
    """Pairs a user's phone with the viewer by a short code, and keeps each paired phone until it is
    unpaired."""

    name = "journal.core.phone"
    requires_engine = ">=5,<6"
    dependencies = PHONE_DEPENDENCIES
    models = [PhoneModelDeclaration, PhoneCodeModelDeclaration]
    guards = [PhoneRowGuard, PhoneCodeRowGuard]
    migrations = PHONE_MIGRATIONS
    subcommands = PHONE_SUBCOMMANDS
    handlers = PHONE_HANDLERS
    listeners = [QuestionNoticeListener, PlanNoticeListener]
    bindings = {PushService: WebPush, PushTransport: PushTransport}
    settings = [PhoneSettingValues]
    windows = PHONE_WINDOWS
    seeders = [PhoneSeeder]
    moves = [PhoneMove]
    tick_handlers = [PhoneNoticesTickHandler]
