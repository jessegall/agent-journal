from core.modules.assign_rules.declarations.assign_rules_dependencies import ASSIGN_RULES_DEPENDENCIES
from core.modules.assign_rules.declarations.assign_rules_migrations import ASSIGN_RULES_MIGRATIONS
from core.modules.assign_rules.declarations.assign_rules_handlers import ASSIGN_RULES_HANDLERS
from core.modules.assign_rules.declarations.assign_rules_subcommands import ASSIGN_RULES_SUBCOMMANDS
from core.modules.assign_rules.models.declarations.assign_rule_model_declaration import AssignRuleModelDeclaration
from core.modules.assign_rules.models.declarations.assign_rule_condition_model_declaration import AssignRuleConditionModelDeclaration
from core.modules.assign_rules.models.declarations.assign_decision_model_declaration import AssignDecisionModelDeclaration
from engine.module.module import Module
from core.modules.assign_rules.listeners.agent_start_retry_listener import AgentStartRetryListener
from core.modules.assign_rules.guards.assign_rule_person_guard import AssignRulePersonGuard
from core.modules.assign_rules.listeners.auto_assign_tag_listener import AutoAssignTagListener
from core.modules.assign_rules.listeners.auto_assign_task_listener import AutoAssignTaskListener
from core.modules.assign_rules.guards.assign_rule_target_guard import AssignRuleTargetGuard
from core.modules.assign_rules.support.assign_rules_agent_messages import ASSIGN_RULES_AGENT_MESSAGES
from core.modules.assign_rules.support.rules.rule_assignment_reasons import RuleAssignmentReasons
from core.modules.assignments.support.assignment_reasons import AssignmentReasons
from core.modules.assign_rules.tick_handlers.judge_skipped_tasks_tick_handler import JudgeSkippedTasksTickHandler



class AssignRulesModule(Module):
    """Adds a user's standing rules that give new free tasks to the main agent, one agent or the agents of one
    program and model."""

    name = "journal.core.assign_rules"
    seed_reason = "a rule assigns new tasks, which the demo does not make"
    move_reason = "version 4 has no assign rules"
    requires_engine = ">=7,<8"
    dependencies = ASSIGN_RULES_DEPENDENCIES
    models = [AssignRuleModelDeclaration, AssignRuleConditionModelDeclaration, AssignDecisionModelDeclaration]
    migrations = ASSIGN_RULES_MIGRATIONS
    listeners = [AutoAssignTaskListener, AutoAssignTagListener, AgentStartRetryListener]
    handlers = ASSIGN_RULES_HANDLERS
    subcommands = ASSIGN_RULES_SUBCOMMANDS
    guards = [AssignRulePersonGuard, AssignRuleTargetGuard]
    bindings = {AssignmentReasons: RuleAssignmentReasons}
    agent_messages = ASSIGN_RULES_AGENT_MESSAGES
    tick_handlers = [JudgeSkippedTasksTickHandler]
