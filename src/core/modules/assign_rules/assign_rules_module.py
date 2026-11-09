from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.assign_rules.migrations.m001_assign_rules import AssignRulesMigration
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition

EXCLUDED_WRITES = ["make", "edit", "delete"]


class AssignRulesModule(Module):
    """Adds a person's standing rules that give new free tasks to the main agent, one agent or a kind of agent."""

    name = "journal.core.assign_rules"
    seed_reason = "a rule assigns new tasks, which the demo does not make"
    move_reason = "version 4 has no assign rules"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks"]
    models = [ModelDeclaration(AssignRule, excluded_subcommands=EXCLUDED_WRITES), ModelDeclaration(AssignRuleCondition, excluded_subcommands=EXCLUDED_WRITES), ModelDeclaration(AssignDecision, excluded_subcommands=EXCLUDED_WRITES)]
    migrations = [AssignRulesMigration]
