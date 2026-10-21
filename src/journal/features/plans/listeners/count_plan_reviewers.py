from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans
from journal.support.actor import Actor
from journal.support.subagents import Subagents


class CountPlanReviewers(AgentListener[AgentEvent]):
    """A plan in review keeps the count of its reviewers still out, the subagents of the live agents whose brief names it, so a reviewer coming back changes the plan the viewer shows."""

    def __init__(self, plans: Plans, agents: Agents, subagents: Subagents) -> None:
        self.plans, self.agents, self.subagents = plans, agents, subagents

    def handle(self, event: AgentEvent) -> None:
        for plan in self.plans.reviewing():
            output = sum(self.subagents.running_mentioning(agent.session, f"plan {plan.id}") for agent in self.agents.scoped() if agent.state != "ended")
            if output != plan.reviewers:
                self.plans.save(plan.with_(reviewers=output), Actor.system())
