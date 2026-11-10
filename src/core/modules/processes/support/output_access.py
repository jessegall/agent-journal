from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process


class OutputAccess:
    """Applies the suite's output access policy to the actor reading an output."""

    def __init__(self, rows: EventRows, suites: SuiteChoice) -> None:
        self.rows, self.suites = rows, suites

    def agent(self, actor: Actor) -> Agent | None:
        if actor.type is not ActorType.AGENT:
            return None
        return self.rows.required(Agent, actor.id)

    def has_private_outputs(self, actor: Actor) -> bool:
        agent = self.agent(actor)
        return agent is not None and agent.role in self.suites.agent_policy().private_output_roles

    def process(self, actor: Actor, process_id: int) -> Process:
        process = self.rows.required(Process, process_id)
        if self.has_private_outputs(actor) and process.session_agent_id != actor.id:
            raise Refusal(f"output {process_id} is not yours", "your suite allows you to read only your own outputs")
        return process
