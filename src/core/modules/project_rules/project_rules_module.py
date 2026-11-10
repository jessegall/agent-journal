from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.skill.skill_declaration import SkillDeclaration
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.viewer.window_icon import WindowIcon
from engine.viewer.window_loading import WindowLoading
from engine.viewer.window_place import WindowPlace
from core.modules.project_rules.commands.make_rule.make_rule_handler import MakeRuleHandler
from core.modules.project_rules.commands.make_rule.make_rule_subcommand import MakeRuleSubcommand
from core.modules.project_rules.listeners.rule_dock_listener import RuleDockListener
from core.modules.project_rules.migrations.m001_rules import RulesTableMigration
from core.modules.project_rules.migrations.m002_memory_rules import MemoryRulesMigration
from core.modules.project_rules.migrations.m003_plain_memories import PlainMemoriesMigration
from core.modules.project_rules.guards.rule_approval_guard import RuleApprovalGuard
from core.modules.project_rules.models.project_rule import ProjectRule
from core.modules.project_rules.rules.start_rules_rule import StartRulesRule
from core.modules.project_rules.support.rule_nudges import RULE_NUDGES
from core.modules.project_rules.support.rule_settings import RULE_SETTINGS
from core.modules.project_rules.support.skeletons import PROJECT_RULES_RULES_SKELETON
from core.modules.project_rules.upgrade.rules_move import RulesMove

class ProjectRulesModule(Module):
    """Adds project rules: standing instructions every agent gets at its start, which a person approves."""

    name = "journal.core.project-rules"
    seed_reason = "the demo shows no rules yet"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.docking", "journal.core.memories", "journal.core.reminders", "journal.core.settings", "journal.core.viewer"]
    models = [ModelDeclaration(ProjectRule, excluded_subcommands=["make"])]
    migrations = [RulesTableMigration, MemoryRulesMigration, PlainMemoriesMigration]
    moves = [RulesMove]
    handlers = [MakeRuleHandler]
    subcommands = [MakeRuleSubcommand]
    listeners = [RuleDockListener]
    guards = [RuleApprovalGuard]
    settings = RULE_SETTINGS
    nudges = RULE_NUDGES
    skills = [SkillDeclaration("journal-rules", "Declare project rules, the standing instructions every agent gets at its start; read it before the first rule command of a session", keywords=("rule", "rules"), commands=["rule"])]
    driver_rules = [StartRulesRule]
    windows = [WindowDeclaration("project-rules.rules", "Rules", "rules.js", WindowLoading.COMPONENT, skeleton=PROJECT_RULES_RULES_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.RULE, reads=["rule list"],
                                 keys=[WindowKey("rules", "rule list", events=["rule.*"], arguments=["limit", "before-id", "after-id"], page_size=50)],
                                 runs=["rule approve", "rule deny", "rule remove"], events=["rule.*"])]
