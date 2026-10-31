from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.phone.commands.pair_phone_handler import PairPhoneHandler
from core.modules.phone.commands.pair_phone_subcommand import PairPhoneSubcommand
from core.modules.phone.commands.phone_session_subcommand import PhoneSessionSubcommand
from core.modules.phone.commands.redeem_phone_code_handler import RedeemPhoneCodeHandler
from core.modules.phone.commands.redeem_phone_code_subcommand import RedeemPhoneCodeSubcommand
from core.modules.phone.commands.unpair_phone import UnpairPhone
from core.modules.phone.migrations.m001_phones import PhonesTablesMigration
from core.modules.phone.models.phone_code import PhoneCode
from core.modules.phone.models.phone import Phone
from core.modules.phone.guards.phone_row_guard import PhoneRowGuard
from core.modules.phone.guards.phone_code_row_guard import PhoneCodeRowGuard
from core.modules.phone.seeders.phone_seeder import PhoneSeeder


class PhoneModule(Module):
    """Pairs a person's phone with the viewer by a short code, and keeps each paired phone until it is unpaired."""

    name = "journal.core.phone"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [ModelDeclaration(Phone, commands=[UnpairPhone], excluded_subcommands=["make", "edit"]),
              ModelDeclaration(PhoneCode, excluded_subcommands=["make", "list", "show", "edit", "delete"])]
    guards = [PhoneRowGuard, PhoneCodeRowGuard]
    migrations = [PhonesTablesMigration]
    subcommands = (PairPhoneSubcommand, RedeemPhoneCodeSubcommand, PhoneSessionSubcommand)
    handlers = [PairPhoneHandler, RedeemPhoneCodeHandler]
    windows = [WindowDeclaration("phone.phones", "Phones", "phones.js", WindowLoading.COMPONENT, icon=WindowIcon.PHONE,
                                 reads=["phone list"], runs=["phone pair", "phone unpair"], events=["phone.*"])]
    seeders = [PhoneSeeder]
