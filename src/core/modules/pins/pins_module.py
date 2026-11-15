from core.modules.pins.lines.agent_text_pin_lines import AgentTextPinLines
from core.modules.pins.lines.link_pin_lines import LinkPinLines
from core.modules.pins.effects.agent_text_pin_effect import AgentTextPinEffect
from core.modules.pins.effects.automatic_link_pin_effect import AutomaticLinkPinEffect
from core.modules.pins.models.declarations.pin_model_declaration import PinModelDeclaration
from core.modules.pins.rules.agent_text_pin_rule import AgentTextPinRule
from core.modules.pins.rules.link_pin_rule import LinkPinRule
from core.modules.pins.rules.automatic_link_pin_rule import AutomaticLinkPinRule
from core.modules.pins.support.pin_nudges import PIN_NUDGES
from engine.module.module import Module
from core.modules.pins.commands.close_pin.close_pin_handler import ClosePinHandler
from core.modules.pins.commands.close_pin.close_pin_subcommand import ClosePinSubcommand
from core.modules.pins.commands.make_pin.make_pin_handler import MakePinHandler
from core.modules.pins.commands.make_pin.make_pin_subcommand import MakePinSubcommand
from core.modules.pins.commands.pin_list.pin_list_subcommand import PinListSubcommand
from core.modules.pins.migrations.m001_pins import PinsTableMigration
from core.modules.pins.seeders.pins_seeder import PinsSeeder
from core.modules.pins.upgrade.pins_move import PinsMove


class PinsModule(Module):
    """Adds pins: links pinned above an environment's chat for the user to open on their return."""

    name = "journal.core.pins"
    effects = [AgentTextPinEffect, AutomaticLinkPinEffect]
    lines = [AgentTextPinLines, LinkPinLines]
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.drivers"]
    nudges = PIN_NUDGES
    driver_rules = [LinkPinRule, AgentTextPinRule, AutomaticLinkPinRule]
    seeders = [PinsSeeder]
    models = [PinModelDeclaration]
    migrations = [PinsTableMigration]
    moves = [PinsMove]
    handlers = [MakePinHandler, ClosePinHandler]
    subcommands = [MakePinSubcommand, ClosePinSubcommand, PinListSubcommand]
