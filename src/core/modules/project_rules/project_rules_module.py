from core.modules.project_rules.windows.project_rules_windows import PROJECT_RULES_WINDOWS
from core.modules.project_rules.models.declarations.project_rule_model_declaration import ProjectRuleModelDeclaration
from core.modules.project_rules.skills.declarations.project_rules_skills import PROJECT_RULES_SKILLS
from engine.module.module import Module
from core.modules.project_rules.commands.make_rule.make_rule_handler import MakeRuleHandler
from core.modules.project_rules.commands.make_rule.make_rule_subcommand import MakeRuleSubcommand
from core.modules.project_rules.listeners.rule_dock_listener import RuleDockListener
from core.modules.project_rules.migrations.m001_rules import RulesTableMigration
from core.modules.project_rules.migrations.m002_memory_rules import MemoryRulesMigration
from core.modules.project_rules.migrations.m003_plain_memories import PlainMemoriesMigration
from core.modules.project_rules.guards.rule_approval_guard import RuleApprovalGuard
from core.modules.project_rules.rules.start_rules_rule import StartRulesRule
from core.modules.project_rules.support.rule_nudges import RULE_NUDGES
from core.modules.project_rules.support.rule_settings import RULE_SETTINGS
from core.modules.project_rules.upgrade.rules_move import RulesMove

class ProjectRulesModule(Module):
    """Adds project rules: standing instructions every agent gets at its start, which a user approves."""

    name = "journal.core.project-rules"
    seed_reason = "the demo shows no rules yet"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.docking", "journal.core.memories", "journal.core.reminders", "journal.core.settings", "journal.core.viewer"]
    models = [ProjectRuleModelDeclaration]
    migrations = [RulesTableMigration, MemoryRulesMigration, PlainMemoriesMigration]
    moves = [RulesMove]
    handlers = [MakeRuleHandler]
    subcommands = [MakeRuleSubcommand]
    listeners = [RuleDockListener]
    guards = [RuleApprovalGuard]
    settings = RULE_SETTINGS
    nudges = RULE_NUDGES
    skills = PROJECT_RULES_SKILLS
    driver_rules = [StartRulesRule]
    windows = PROJECT_RULES_WINDOWS
