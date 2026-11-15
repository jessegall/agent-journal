from core.modules.phone.windows.phone_windows import PHONE_WINDOWS
from core.modules.phone.models.declarations.phone_model_declaration import PhoneModelDeclaration
from core.modules.phone.models.declarations.phone_code_model_declaration import PhoneCodeModelDeclaration
from core.modules.phone.settings.phone_setting_values import PhoneSettingValues
from core.modules.phone.migrations.m004_phone_notice_index import PhoneNoticeIndexMigration
from engine.module.module import Module
from core.modules.phone.commands.pair_phone.pair_phone_handler import PairPhoneHandler
from core.modules.phone.commands.pair_phone.pair_phone_subcommand import PairPhoneSubcommand
from core.modules.phone.commands.phone_session.phone_session_subcommand import PhoneSessionSubcommand
from core.modules.phone.commands.redeem_phone_code.redeem_phone_code_handler import RedeemPhoneCodeHandler
from core.modules.phone.commands.redeem_phone_code.redeem_phone_code_subcommand import RedeemPhoneCodeSubcommand
from core.modules.phone.migrations.m001_phones import PhonesTablesMigration
from core.modules.phone.guards.phone_row_guard import PhoneRowGuard
from core.modules.phone.guards.phone_code_row_guard import PhoneCodeRowGuard
from core.modules.phone.upgrade.phone_move import PhoneMove
from core.modules.phone.seeders.phone_seeder import PhoneSeeder
from core.modules.phone.commands.ensure_push_keys.ensure_push_keys_handler import EnsurePushKeysHandler
from core.modules.phone.commands.ensure_push_keys.ensure_push_keys_subcommand import EnsurePushKeysSubcommand
from core.modules.phone.commands.subscribe_phone.subscribe_phone_handler import SubscribePhoneHandler
from core.modules.phone.commands.subscribe_phone.subscribe_phone_subcommand import SubscribePhoneSubcommand
from core.modules.phone.listeners.plan_notice_listener import PlanNoticeListener
from core.modules.phone.listeners.question_notice_listener import QuestionNoticeListener
from core.modules.phone.migrations.m002_phone_subscription import PhoneSubscriptionMigration
from core.modules.phone.migrations.m003_phone_notice_waiting import PhoneNoticeWaitingMigration
from core.modules.phone.commands.note_phone_notice.note_phone_notice_handler import NotePhoneNoticeHandler
from core.modules.phone.commands.send_phone_notices.send_phone_notices_handler import SendPhoneNoticesHandler
from core.modules.phone.support.push_service import PushService
from core.modules.phone.support.push_transport import PushTransport
from core.modules.phone.push.web_push import WebPush
from core.modules.phone.tick_handlers.phone_notices_tick_handler import PhoneNoticesTickHandler


class PhoneModule(Module):
    """Pairs a user's phone with the viewer by a short code, and keeps each paired phone until it is
    unpaired."""

    name = "journal.core.phone"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.settings", "journal.core.tunnel", "journal.core.questions", "journal.core.plans", "journal.core.agents"]
    models = [PhoneModelDeclaration, PhoneCodeModelDeclaration]
    guards = [PhoneRowGuard, PhoneCodeRowGuard]
    migrations = [PhoneNoticeIndexMigration, PhonesTablesMigration, PhoneSubscriptionMigration, PhoneNoticeWaitingMigration]
    subcommands = [PairPhoneSubcommand, RedeemPhoneCodeSubcommand, PhoneSessionSubcommand, EnsurePushKeysSubcommand, SubscribePhoneSubcommand]
    handlers = [PairPhoneHandler, RedeemPhoneCodeHandler, EnsurePushKeysHandler, SubscribePhoneHandler, NotePhoneNoticeHandler, SendPhoneNoticesHandler]
    listeners = [QuestionNoticeListener, PlanNoticeListener]
    bindings = {PushService: WebPush, PushTransport: PushTransport}
    settings = [PhoneSettingValues]
    windows = PHONE_WINDOWS
    seeders = [PhoneSeeder]
    moves = [PhoneMove]
    tick_handlers = [PhoneNoticesTickHandler]
