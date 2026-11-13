from datetime import timedelta

from engine.enums.agent_role import AgentRole
from engine.enums.helper_role import HelperRole
from engine.query.queries import Queries
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.enums.rule_target import RuleTarget
from core.modules.assign_rules.queries.assign_decision_query import AssignDecisionQuery
from core.modules.assign_rules.support.board.assign_board import AssignBoard
from core.modules.assign_rules.support.board.board_condition import BoardCondition
from core.modules.assign_rules.support.board.board_rule import BoardRule
from core.modules.assign_rules.support.board.board_target import BoardTarget
from core.modules.assign_rules.support.board.rule_activity import RuleActivity
from core.modules.assign_rules.support.condition_line import ConditionLine
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.assign_rules.support.rule_revision import RuleRevision
from core.modules.tasks.queries.task_query import TaskQuery

AGENTS_REASON = "the Assign tab lists every agent of the environment that takes tasks and warns of rules for retired ones"
RULES_REASON = "the Assign tab shows every rule of the environment"
MAIN_TARGET = BoardTarget("main", RuleTarget.MAIN, "Main agent")
ACTIVITY_WINDOW = timedelta(days=1)


class AssignBoardReader:
    """Reads what the Assign tab shows: the main agent once, each agent that may take tasks and is not
    retired, each program and model those agents run on, and the rules with their conditions in plain words
    and what each did in the last day."""

    def __init__(self, queries: Queries, conditions: RuleConditions, revision: RuleRevision, tasks: TaskQuery, decisions: AssignDecisionQuery, clock: Clock) -> None:
        self.queries, self.conditions, self.revision, self.tasks = queries, conditions, revision, tasks
        self.decisions, self.clock = decisions, clock

    def read(self) -> AssignBoard:
        agents = list(self.queries.query(Agent).every_row(AGENTS_REASON))
        task_takers = [agent for agent in agents if self.takes_tasks(agent)]
        program_models = sorted({(agent.program, agent.program_model) for agent in task_takers if agent.program_model})
        targets = (MAIN_TARGET, *(self.agent_target(agent) for agent in task_takers), *(BoardTarget(f"model:{program}:{model}", RuleTarget.MODEL, f"{program} {model}", program=program, program_model=model) for program, model in program_models))
        retired = {agent.id for agent in agents if agent.retired_at is not None}
        rules = sorted(self.queries.query(AssignRule).every_row(RULES_REASON), key=lambda rule: rule.position)
        lines = self.conditions.lines_by_rule(rules)
        given = self.decisions.given_since(Timestamp(self.clock.timestamp().value - ACTIVITY_WINDOW))
        matched = self.decisions.matched_rule_ids([rule.id for rule in rules])
        skips = self.decisions.last_skips()
        activities = {rule.id: RuleActivity(given.get(rule.id, 0), rule.id in matched, skips.get(rule.id, "")) for rule in rules}
        return AssignBoard(self.revision.current(), targets, tuple(self.board_rule(rule, lines[rule.id], retired, activities[rule.id]) for rule in rules))

    @staticmethod
    def takes_tasks(agent: Agent) -> bool:
        return agent.role != AgentRole.MAIN and agent.role not in tuple(HelperRole) and agent.retired_at is None

    def agent_target(self, agent: Agent) -> BoardTarget:
        return BoardTarget(f"agent:{agent.id}", RuleTarget.AGENT, AgentLabel.labelled(agent).text, agent_id=agent.id, program=agent.program, program_model=agent.program_model,
                           running=agent.ended_at is None, open_tasks=len(self.tasks.unfinished_assigned(agent.id)))

    def board_rule(self, rule: AssignRule, lines: tuple[ConditionLine, ...], retired: set[int], activity: RuleActivity) -> BoardRule:
        conditions = tuple(BoardCondition(line.field, line.operator, line.value, line.label) for line in lines)
        warning = "its agent is retired" if rule.target is RuleTarget.AGENT and rule.agent_id in retired else ""
        return BoardRule(rule.id, rule.position, rule.enabled, rule.target, self.target_key(rule), rule.target_name, rule.queue_limit, conditions, warning, activity)

    @staticmethod
    def target_key(rule: AssignRule) -> str:
        match rule.target:
            case RuleTarget.AGENT:
                return f"agent:{rule.agent_id}"
            case RuleTarget.MODEL:
                return f"model:{rule.program}:{rule.program_model}"
            case _:
                return MAIN_TARGET.key
