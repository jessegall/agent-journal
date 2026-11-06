from core.modules.phone.migrations.m004_phone_notice_index import PhoneNoticeIndexMigration
from core.base.module.model_declaration import ModelDeclaration
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.modules.phone.ticks.phone_notices import PhoneNotices
from core.base.module.module import Module
from core.base.viewer.window_search import WindowSearch
from core.modules.phone.support.phone_searcher import PhoneSearcher
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.phone.commands.pair_phone.pair_phone_handler import PairPhoneHandler
from core.modules.phone.commands.pair_phone.pair_phone_subcommand import PairPhoneSubcommand
from core.modules.phone.commands.phone_session.phone_session_subcommand import PhoneSessionSubcommand
from core.modules.phone.commands.redeem_phone_code.redeem_phone_code_handler import RedeemPhoneCodeHandler
from core.modules.phone.commands.redeem_phone_code.redeem_phone_code_subcommand import RedeemPhoneCodeSubcommand
from core.modules.phone.commands.unpair_phone.unpair_phone import UnpairPhone
from core.modules.phone.migrations.m001_phones import PhonesTablesMigration
from core.modules.phone.models.phone_code import PhoneCode
from core.modules.phone.models.phone import Phone
from core.modules.phone.guards.phone_row_guard import PhoneRowGuard
from core.modules.phone.guards.phone_code_row_guard import PhoneCodeRowGuard
from core.modules.phone.upgrade.phone_move import PhoneMove
from core.modules.phone.seeders.phone_seeder import PhoneSeeder
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
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
from core.modules.phone.support.skeletons import PHONE_PHONES_SKELETON


class PhoneModule(Module):
    """Pairs a person's phone with the viewer by a short code, and keeps each paired phone until it is
    unpaired."""

    name = "journal.core.phone"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.settings", "journal.core.tunnel", "journal.core.questions", "journal.core.plans"]
    models = [ModelDeclaration(Phone, commands=[UnpairPhone], excluded_subcommands=["make", "edit"]),
              ModelDeclaration(PhoneCode, excluded_subcommands=["make", "list", "show", "edit", "delete"])]
    guards = [PhoneRowGuard, PhoneCodeRowGuard]
    migrations = [PhoneNoticeIndexMigration, PhonesTablesMigration, PhoneSubscriptionMigration, PhoneNoticeWaitingMigration]
    subcommands = [PairPhoneSubcommand, RedeemPhoneCodeSubcommand, PhoneSessionSubcommand, EnsurePushKeysSubcommand, SubscribePhoneSubcommand]
    handlers = [PairPhoneHandler, RedeemPhoneCodeHandler, EnsurePushKeysHandler, SubscribePhoneHandler, NotePhoneNoticeHandler, SendPhoneNoticesHandler]
    listeners = [QuestionNoticeListener, PlanNoticeListener]
    bindings = {PushService: WebPush, PushTransport: PushTransport}
    settings = [SettingValue("push-private-key", "Push signing key", "The secret half of the key pair the journal signs phone notices with.", SettingType.TEXT,
                             secret=True, scope=SettingScope.PROJECT),
                SettingValue("push-public-key", "Push public key", "The public half of the key pair, which a phone subscribes to notices with.", SettingType.TEXT,
                             secret=True, scope=SettingScope.PROJECT)]
    windows = [WindowDeclaration("phone.phones", "Phones", "phones.js", WindowLoading.COMPONENT, skeleton=PHONE_PHONES_SKELETON, search=WindowSearch(PhoneSearcher, "Search the phones"), group="project", icon=WindowIcon.PHONE,
                                 reads=["phone list", "tunnel status"], keys=[WindowKey("phones", "phone list", events=["phone.*"]),
                                       WindowKey("tunnel", "tunnel status")], runs=["phone pair", "phone unpair"], events=["phone.*"])]
    seeders = [PhoneSeeder]
    moves = [PhoneMove]
    tick_handlers = [TickHandler(TickInterval(seconds=60), PhoneNotices(), "phone notices", starts_immediately=True)]
