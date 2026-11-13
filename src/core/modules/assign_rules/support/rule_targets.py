from dataclasses import dataclass

from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.enums.rule_target import RuleTarget
from core.modules.assign_rules.support.decision_batch import DecisionBatch
from core.modules.assignments.models.assignment import Assignment
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.task_assignees import TaskAssignees

KIND_AGENTS_REASON = "a kind target is chosen among every agent of the environment on its program and model"


@dataclass(frozen=True)
class Usable:
    """The agent a rule's target resolves to now, or why none can take the task; for a usable agent the reason
    notes a limit or a pause."""

    actor_id: int | None
    reason: str


class RuleTargets:
    """Resolves a rule's target to one agent that can take a task now: the running main agent, the one agent named,
    or an agent of the program and model named, the one with the fewest open tasks and, on a tie, the one that has
    waited longest for a new task. The suite's own checks are reached through TaskAssignees, as AssignTask reaches
    them, and a refusal there means that agent cannot take it."""

    def __init__(self, queries: Queries, assignees: TaskAssignees, tasks: TaskQuery) -> None:
        self.queries, self.assignees, self.tasks = queries, assignees, tasks

    def usable(self, rule: AssignRule, batch: DecisionBatch) -> Usable:
        match rule.target:
            case RuleTarget.AGENT:
                return self.named_agent(rule, batch)
            case RuleTarget.MODEL:
                return self.kind_agent(rule, batch)
            case _:
                return self.main_agent(rule, batch)

    def main_agent(self, rule: AssignRule, batch: DecisionBatch) -> Usable:
        main = MainAgentFinder.newest(self.queries)
        if main is None:
            return Usable(None, "no main agent runs")
        return self.checked(main, rule, batch)

    def named_agent(self, rule: AssignRule, batch: DecisionBatch) -> Usable:
        agent = None if rule.agent_id is None else self.queries.query(Agent).filter(id=rule.agent_id).first()
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

    def kind_agent(self, rule: AssignRule, batch: DecisionBatch) -> Usable:
        none_can = f"no worker of {rule.program} {rule.program_model} can take it now"
        agents = [agent for agent in self.queries.query(Agent).every_row(KIND_AGENTS_REASON) if agent.role != AgentRole.MAIN and self.is_of_kind(agent, rule)]
        if not agents:
            return Usable(None, f"{none_can}: no worker of this kind")
        ready = [agent for agent in agents if not agent.is_paused and agent.usage_limit_ends_at is None and self.checked(agent, rule, batch).actor_id is not None]
        if not ready:
            return Usable(None, none_can)
        chosen = min(ready, key=lambda agent: (self.held(agent, batch), batch.last_turn(agent.id), self.last_given_at(agent, batch), agent.id))
        return Usable(chosen.id, f"{AgentLabel.labelled(chosen).text} holds the fewest open tasks of its kind")

    def held(self, agent: Agent, batch: DecisionBatch) -> int:
        return batch.held(agent.id, lambda: len(self.tasks.unfinished_assigned(agent.id)))

    def last_given_at(self, agent: Agent, batch: DecisionBatch) -> str:
        return batch.last_given_at(agent.id, lambda: self.newest_assignment_time(agent))

    def newest_assignment_time(self, agent: Agent) -> str:
        newest = self.queries.query(Assignment).filter(actor_id=agent.id, subject_model=Task.model_name).newest().first()
        return "" if newest is None else newest.creation_timestamp().text

    @staticmethod
    def is_of_kind(agent: Agent, rule: AssignRule) -> bool:
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
        held = self.held(agent, batch)
        if rule.queue_limit and held >= rule.queue_limit:
            return Usable(None, f"{label} holds {held} of {rule.queue_limit}")
        return Usable(agent.id, "")
