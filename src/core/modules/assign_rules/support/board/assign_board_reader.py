from dataclasses import replace
from datetime import timedelta

from engine.enums.agent_role import AgentRole
from engine.enums.helper_role import HelperRole
from engine.query.queries import Queries
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.enums.rule_target import RuleTarget
from core.modules.assign_rules.queries.assign_decision_query import AssignDecisionQuery
from core.modules.assign_rules.support.board.assign_board import AssignBoard
from core.modules.assign_rules.support.board.board_condition import BoardCondition
from core.modules.assign_rules.support.board.board_rule import BoardRule
from core.modules.assign_rules.support.board.board_target import BoardTarget
from core.modules.assign_rules.support.board.rule_activity import RuleActivity
from core.modules.assign_rules.support.board.waiting_task import WaitingTask
from core.modules.assign_rules.support.condition_line import ConditionLine
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.assign_rules.support.rule_revision import RuleRevision
from core.modules.assign_rules.support.rule_warnings import RuleWarnings
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery

AGENTS_REASON = "the Assign tab lists every agent of the environment that takes tasks and warns of rules for retired ones"
RULES_REASON = "the Assign tab shows every rule of the environment"
MAIN_TARGET = BoardTarget("main", RuleTarget.MAIN, "Main agent")
ACTIVITY_WINDOW = timedelta(days=1)


class AssignBoardReader:
    """Reads what the Assign tab shows: the main agent once, each agent that may take tasks and is not
    retired, each with the oldest unstarted task a rule gave it, each program and model those agents run on,
    and the rules with their conditions in plain words, what each did in the last day, and a warning when its
    target cannot take its tasks."""

    def __init__(self, queries: Queries, conditions: RuleConditions, tasks: TaskQuery, decisions: AssignDecisionQuery, clock: Clock, warnings: RuleWarnings) -> None:
        self.queries, self.conditions, self.tasks = queries, conditions, tasks
        self.decisions, self.clock, self.warnings = decisions, clock, warnings

    def read(self) -> AssignBoard:
        agents = list(self.queries.query(Agent).every_row(AGENTS_REASON))
        task_agents = [agent for agent in agents if self.takes_tasks(agent)]
        program_models = sorted({(agent.program, agent.program_model) for agent in task_agents if agent.program_model})
        waiting = self.waiting_texts()
        main = MainAgentFinder.newest(self.queries)
        main_target = MAIN_TARGET if main is None else replace(MAIN_TARGET, waiting=waiting.get(main.id, ""))
        targets = (main_target, *(self.agent_target(agent, waiting.get(agent.id, "")) for agent in task_agents), *(BoardTarget(f"model:{program}:{model}", RuleTarget.MODEL, f"{program} {model}", program=program, program_model=model) for program, model in program_models))
        agent_rows = {agent.id: agent for agent in agents}
        rules = sorted(self.queries.query(AssignRule).every_row(RULES_REASON), key=lambda rule: rule.position)
        lines = self.conditions.rule_lines(rules)
        given = self.decisions.assigned_counts(Timestamp(self.clock.timestamp().value - ACTIVITY_WINDOW))
        matched = self.decisions.matched_rule_ids([rule.id for rule in rules])
        skips = self.decisions.last_skips()
        activities = {rule.id: RuleActivity(given.get(rule.id, 0), rule.id in matched, skips.get(rule.id, "")) for rule in rules}
        return AssignBoard(RuleRevision.rules_revision(rules, lines), targets, tuple(self.board_rule(rule, lines[rule.id], agent_rows, activities[rule.id]) for rule in rules))

    @staticmethod
    def agent_warning(agent_id: int | None, agent_rows: dict[int, Agent]) -> str:
        agent = None if agent_id is None else agent_rows.get(agent_id)
        if agent is None:
            return "its agent is gone"
        return "its agent is retired" if agent.retired_at is not None else ""

    @staticmethod
    def takes_tasks(agent: Agent) -> bool:
        return agent.role != AgentRole.MAIN and agent.role not in tuple(HelperRole) and agent.retired_at is None

    def agent_target(self, agent: Agent, waiting: str) -> BoardTarget:
        return BoardTarget(f"agent:{agent.id}", RuleTarget.AGENT, AgentLabel.labelled(agent).text, agent_id=agent.id, program=agent.program, program_model=agent.program_model,
                           running=agent.ended_at is None, open_tasks=len(self.tasks.unfinished_assigned(agent.id)), waiting=waiting)

    def waiting_texts(self) -> dict[int, str]:
        oldest = self.decisions.oldest_given(self.tasks.open_tasks().select_columns("id"))
        if not oldest:
            return {}
        tasks = {task.id: task for task in self.queries.query(Task).find_many(list(oldest.values()))}
        current_time = self.clock.timestamp()
        return {actor_id: WaitingTask(task_id, tasks[task_id].creation_timestamp().elapsed_seconds(current_time)).text for actor_id, task_id in oldest.items()}

    def board_rule(self, rule: AssignRule, lines: tuple[ConditionLine, ...], agent_rows: dict[int, Agent], activity: RuleActivity) -> BoardRule:
        conditions = tuple(BoardCondition(line.field, line.operator, line.value, line.label) for line in lines)
        warnings = [self.agent_warning(rule.target_agent_id, agent_rows) if rule.target is RuleTarget.AGENT else "", self.route_warning(rule, lines, agent_rows)]
        warning = "; ".join(text for text in warnings if text)
        return BoardRule(rule.id, rule.position, rule.enabled, rule.target, self.target_key(rule), rule.target_name, rule.queue_limit, conditions, warning, activity)

    def route_warning(self, rule: AssignRule, lines: tuple[ConditionLine, ...], agent_rows: dict[int, Agent]) -> str:
        programs = {RuleTarget.MODEL: rule.program, RuleTarget.AGENT: agent_rows[rule.target_agent_id].program if rule.target_agent_id in agent_rows else None}
        program = programs.get(rule.target)
        return "" if program is None else self.warnings.warning(program, lines)

    @staticmethod
    def target_key(rule: AssignRule) -> str:
        match rule.target:
            case RuleTarget.AGENT:
                return f"agent:{rule.target_agent_id}"
            case RuleTarget.MODEL:
                return f"model:{rule.program}:{rule.program_model}"
            case _:
                return MAIN_TARGET.key
