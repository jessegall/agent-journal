from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process


class OutputAccess:
    """Applies the suite's output access policy to the actor reading an output."""

    def __init__(self, queries: Queries, suites: SuiteChoice) -> None:
        self.queries, self.suites = queries, suites

    def agent(self, actor: Actor) -> Agent | None:
        if actor.type is not ActorType.AGENT:
            return None
        return self.queries.query(Agent).find(actor.id)

    def environment(self, actor: Actor, fallback: int | None) -> int:
        agent = self.agent(actor)
        environment_id = agent.environment_id if agent is not None else fallback
        if environment_id is None:
            raise Refusal("outputs are read in an environment", "name one with --environment")
        return environment_id

    def has_private_outputs(self, actor: Actor) -> bool:
        agent = self.agent(actor)
        return agent is not None and agent.role in self.suites.agent_policy(agent.environment_id).private_output_roles

    def process(self, actor: Actor, process_id: int) -> Process:
        process = self.queries.query(Process).find(process_id)
        if self.has_private_outputs(actor) and process.agent_id != actor.id:
            raise Refusal(f"output {process_id} is not yours", "your suite allows you to read only your own outputs")
        return process
