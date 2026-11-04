from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.project_rules.migrations.m001_rules import RulesTableMigration
from core.modules.project_rules.models.project_rule import ProjectRule
from core.modules.project_rules.rules.start_rules_rule import StartRulesRule
from core.modules.project_rules.support.rule_nudges import RULE_NUDGES


class ProjectRulesModule(Module):
    """Adds project rules: standing instructions every agent gets at its start, which a person approves."""

    name = "journal.core.project-rules"
    seed_reason = "the demo shows no rules yet"
    move_reason = "version 4 had no rules of its own"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.drivers"]
    models = [ModelDeclaration(ProjectRule)]
    migrations = [RulesTableMigration]
    nudges = RULE_NUDGES
    driver_rules = [StartRulesRule]
