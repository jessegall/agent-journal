from engine.helper_type.helper_type_book import HelperTypeBook
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.listener.rows.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process


class OutputAccess:
    """Applies the suite's output access policy to the actor reading an output."""

    def __init__(self, rows: EventRows, types: HelperTypeBook) -> None:
        self.rows, self.types = rows, types

    def agent(self, actor: Actor) -> Agent | None:
        if actor.type is not ActorType.AGENT:
            return None
        return self.rows.required(Agent, actor.id)

    def has_private_outputs(self, actor: Actor) -> bool:
        agent = self.agent(actor)
        return agent is not None and self.types.behaviours(agent.role).has_private_outputs

    def process(self, actor: Actor, process_id: int) -> Process:
        process = self.rows.required(Process, process_id)
        if self.has_private_outputs(actor) and process.session_agent_id != actor.id:
            raise Refusal(f"output {process_id} is not yours", "your suite allows you to read only your own outputs")
        return process
