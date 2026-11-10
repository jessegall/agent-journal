from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.models.agent import Agent


class RetiredWorkerRefusal(Refusal):
    exit_code = 5

    @classmethod
    def create(cls, worker: Agent) -> "RetiredWorkerRefusal":
        return cls(f"{AgentLabel.from_agent(worker).text} is retired, for good", "journal worker dispatch <task> starts a new one")
