from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans
from journal.support.actor import Actor
from journal.features.workers.support.subagent_entries import SubagentEntries


class CountPlanReviewers(AgentListener[AgentEvent]):
    """A plan in review keeps the count of its reviewers still out, the subagents of the live agents whose brief names it, so a reviewer coming back changes the plan the viewer shows."""

    def __init__(self, plans: Plans, agents: Agents, subagents: SubagentEntries) -> None:
        self.plans, self.agents, self.subagents = plans, agents, subagents

    def handle(self, event: AgentEvent) -> None:
        for plan in self.plans.reviewing():
            output = sum(self.subagents.running_mentioning(agent.session, f"plan {plan.id}") for agent in self.agents.active_agents())
            if output != plan.reviewers:
                self.plans.save(plan.reviewers_counted(output, event.time), Actor.system())
