from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.enums.rule_target import RuleTarget
from core.modules.assign_rules.support.targets.decision_batch import DecisionBatch
from core.modules.assign_rules.support.targets.usable import Usable
from core.modules.assignments.models.assignment import Assignment
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.task_assignees import TaskAssignees

MODEL_AGENTS_REASON = "a model target is least_busy among every agent of the environment on its program and model"


class RuleTargets:
    """Resolves a rule's target to one agent that can take a task now: the running main agent, the one agent
    named, or an agent of the program and model named, the one with the fewest open tasks and, on a tie, the
    one that has waited longest for a new task. Whether an agent takes tasks is asked of TaskAssignees, as
    AssignTask asks it, and a refusal there means that agent cannot take it."""

    def __init__(self, queries: Queries, assignees: TaskAssignees, tasks: TaskQuery, assignments: Assignments) -> None:
        self.queries, self.assignees, self.tasks, self.assignments = queries, assignees, tasks, assignments

    def usable(self, rule: AssignRule, batch: DecisionBatch) -> Usable:
        match rule.target:
            case RuleTarget.AGENT:
                return self.rule_agent(rule, batch)
            case RuleTarget.MODEL:
                return self.model_agent(rule, batch)
            case _:
                return self.main_agent(rule, batch)

    def main_agent(self, rule: AssignRule, batch: DecisionBatch) -> Usable:
        main = MainAgentFinder.newest(self.queries)
        if main is None:
            return Usable(None, "no main agent runs")
        return self.checked(main, rule, batch)

    def rule_agent(self, rule: AssignRule, batch: DecisionBatch) -> Usable:
        agent = None if rule.target_agent_id is None else self.assignments.agent_row(rule.target_agent_id)
        if agent is None:
            return Usable(None, f"the agent of rule {rule.id} is gone")
        usable = self.checked(agent, rule, batch)
        if usable.actor_id is None:
            return usable
        if agent.is_paused:
            return Usable(agent.id, "paused")
        if agent.usage_limit_ends_at is not None:
            return Usable(agent.id, f"limit ends at {agent.usage_limit_ends_at}")
        return usable

    def model_agent(self, rule: AssignRule, batch: DecisionBatch) -> Usable:
        unavailable_text = f"no agent of {rule.program} {rule.program_model} can take it now"
        agents = [agent for agent in self.queries.query(Agent).every_row(MODEL_AGENTS_REASON) if agent.role != AgentRole.MAIN and self.runs_rule_model(agent, rule)]
        if not agents:
            return Usable(None, f"{unavailable_text}: no agent runs that program and model")
        free_agents = [agent for agent in agents if not agent.is_paused and agent.usage_limit_ends_at is None and self.checked(agent, rule, batch).actor_id is not None]
        if not free_agents:
            return Usable(None, unavailable_text)
        least_busy = min(free_agents, key=lambda agent: (self.open_task_count(agent, batch), batch.last_place(agent.id), self.newest_assignment(agent, batch), agent.id))
        return Usable(least_busy.id, f"{AgentLabel.labelled(least_busy).text} holds the fewest open tasks of its program and model")

    def open_task_count(self, agent: Agent, batch: DecisionBatch) -> int:
        return batch.open_task_count(agent.id, lambda: len(self.tasks.unfinished_assigned(agent.id)))

    def newest_assignment(self, agent: Agent, batch: DecisionBatch) -> str:
        return batch.newest_assignment(agent.id, lambda: self.newest_assignment_time(agent))

    def newest_assignment_time(self, agent: Agent) -> str:
        newest = self.queries.query(Assignment).filter(actor_id=agent.id, subject_model=Task.model_name).newest().first()
        return "" if newest is None else newest.creation_timestamp().text

    @staticmethod
    def runs_rule_model(agent: Agent, rule: AssignRule) -> bool:
        model, agent_model = rule.program_model.lower(), agent.program_model.lower()
        return agent.program.lower() == rule.program.lower() and (agent_model == model or model in agent_model.split("-"))

    def checked(self, agent: Agent, rule: AssignRule, batch: DecisionBatch) -> Usable:
        label = AgentLabel.labelled(agent).text
        if agent.retired_at is not None:
            return Usable(None, f"{label} is retired")
        try:
            self.assignees.check_running(agent)
        except Refusal as refusal:
            return Usable(None, refusal.reason)
        open_tasks = self.open_task_count(agent, batch)
        if rule.queue_limit and open_tasks >= rule.queue_limit:
            return Usable(None, f"{label} holds {open_tasks} of {rule.queue_limit}")
        return Usable(agent.id, None)
