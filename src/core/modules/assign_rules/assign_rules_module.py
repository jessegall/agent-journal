from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.assign_rules.commands.assign_rule_board.assign_rule_board_subcommand import AssignRuleBoardSubcommand
from core.modules.assign_rules.commands.count_assign_rule.count_assign_rule_subcommand import CountAssignRuleSubcommand
from core.modules.assign_rules.commands.delete_assign_rule.delete_assign_rule_handler import DeleteAssignRuleHandler
from core.modules.assign_rules.commands.delete_assign_rule.delete_assign_rule_subcommand import DeleteAssignRuleSubcommand
from core.modules.assign_rules.commands.edit_assign_rule.edit_assign_rule_handler import EditAssignRuleHandler
from core.modules.assign_rules.commands.edit_assign_rule.edit_assign_rule_subcommand import EditAssignRuleSubcommand
from core.modules.assign_rules.commands.make_assign_rule.make_assign_rule_handler import MakeAssignRuleHandler
from core.modules.assign_rules.commands.make_assign_rule.make_assign_rule_subcommand import MakeAssignRuleSubcommand
from core.modules.assign_rules.commands.move_assign_rule.move_assign_rule_handler import MoveAssignRuleHandler
from core.modules.assign_rules.commands.move_assign_rule.move_assign_rule_subcommand import MoveAssignRuleSubcommand
from core.modules.assign_rules.commands.switch_assign_rule.disable_assign_rule_subcommand import DisableAssignRuleSubcommand
from core.modules.assign_rules.commands.switch_assign_rule.enable_assign_rule_subcommand import EnableAssignRuleSubcommand
from core.modules.assign_rules.commands.switch_assign_rule.switch_assign_rule_handler import SwitchAssignRuleHandler
from core.modules.assign_rules.commands.try_assign_rule.try_assign_rule_subcommand import TryAssignRuleSubcommand
from core.modules.assign_rules.commands.judge_task.judge_task_handler import JudgeTaskHandler
from core.modules.assign_rules.guards.assign_rule_person_guard import AssignRulePersonGuard
from core.modules.assign_rules.listeners.auto_assign_tag_listener import AutoAssignTagListener
from core.modules.assign_rules.listeners.auto_assign_task_listener import AutoAssignTaskListener
from core.modules.assign_rules.guards.assign_rule_target_guard import AssignRuleTargetGuard
from core.modules.assign_rules.commands.record_assign_decision.record_assign_decision_handler import RecordAssignDecisionHandler
from core.modules.assign_rules.commands.record_assign_decision.record_assign_decision_subcommand import RecordAssignDecisionSubcommand
from core.modules.assign_rules.migrations.m001_assign_rules import AssignRulesMigration
from core.modules.assign_rules.migrations.m002_decision_indexes import DecisionIndexesMigration
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition

EXCLUDED_WRITES = ["make", "edit", "delete"]


class AssignRulesModule(Module):
    """Adds a user's standing rules that give new free tasks to the main agent, one agent or the agents of one
    program and model."""

    name = "journal.core.assign_rules"
    seed_reason = "a rule assigns new tasks, which the demo does not make"
    move_reason = "version 4 has no assign rules"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.tasks", "journal.core.plans", "journal.core.assignments"]
    models = [ModelDeclaration(AssignRule, excluded_subcommands=EXCLUDED_WRITES), ModelDeclaration(AssignRuleCondition, excluded_subcommands=EXCLUDED_WRITES), ModelDeclaration(AssignDecision, excluded_subcommands=EXCLUDED_WRITES)]
    migrations = [AssignRulesMigration, DecisionIndexesMigration]
    listeners = [AutoAssignTaskListener, AutoAssignTagListener]
    handlers = [RecordAssignDecisionHandler, JudgeTaskHandler, MakeAssignRuleHandler, EditAssignRuleHandler, MoveAssignRuleHandler, SwitchAssignRuleHandler, DeleteAssignRuleHandler]
    subcommands = [MakeAssignRuleSubcommand, EditAssignRuleSubcommand, MoveAssignRuleSubcommand, EnableAssignRuleSubcommand, DisableAssignRuleSubcommand, DeleteAssignRuleSubcommand,
                   TryAssignRuleSubcommand, RecordAssignDecisionSubcommand, AssignRuleBoardSubcommand, CountAssignRuleSubcommand]
    guards = [AssignRulePersonGuard, AssignRuleTargetGuard]
