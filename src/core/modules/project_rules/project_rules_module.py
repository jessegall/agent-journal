from core.base.chat.dock_declaration import DockDeclaration
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.modules.project_rules.commands.make_rule.make_rule_handler import MakeRuleHandler
from core.modules.project_rules.commands.make_rule.make_rule_subcommand import MakeRuleSubcommand
from core.modules.project_rules.listeners.rule_dock_listener import RuleDockListener
from core.modules.project_rules.migrations.m001_rules import RulesTableMigration
from core.modules.project_rules.models.enums.rule_dock_type import RuleDockType
from core.modules.project_rules.models.project_rule import ProjectRule
from core.modules.project_rules.rules.start_rules_rule import StartRulesRule
from core.modules.project_rules.support.rule_nudges import RULE_NUDGES
from core.modules.project_rules.support.rule_settings import RULE_SETTINGS

PROPOSED_SLOT = tuple([f"dock.{RuleDockType.PROPOSED.value}"])
PROPOSED_CONDITION = ButtonCondition("state", tuple(["proposed"]))


class ProjectRulesModule(Module):
    """Adds project rules: standing instructions every agent gets at its start, which a person approves."""

    name = "journal.core.project-rules"
    seed_reason = "the demo shows no rules yet"
    move_reason = "version 4 had no rules of its own"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.docking", "journal.core.settings", "journal.core.viewer"]
    models = [ModelDeclaration(ProjectRule, excluded_subcommands=["make"])]
    migrations = [RulesTableMigration]
    handlers = [MakeRuleHandler]
    subcommands = [MakeRuleSubcommand]
    listeners = [RuleDockListener]
    settings = RULE_SETTINGS
    nudges = RULE_NUDGES
    driver_rules = [StartRulesRule]
    docks = [DockDeclaration(RuleDockType.PROPOSED, "rule", "Proposed rule", "rule-dock.js", most=6, reads=["rule show"], badge="Needs you")]
    button_slots = list(PROPOSED_SLOT)
    buttons = [ButtonDeclaration("project-rules.approve", PROPOSED_SLOT, "Approve", "rule approve {row_id}", primary=True, condition=PROPOSED_CONDITION),
               ButtonDeclaration("project-rules.deny", PROPOSED_SLOT, "Deny", "rule deny {row_id}", condition=PROPOSED_CONDITION)]
