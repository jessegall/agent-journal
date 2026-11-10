from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_save_attempts import ReaderSaveAttempts
from core.modules.processes.support.reader_selection import ReaderSelection


class ReaderWriters:
    """Allows reader management and saves for an agent's own reader requests."""

    def __init__(self, agents: AgentRows, requests: ReaderRequestQuery, attempts: ReaderSaveAttempts, suites: SuiteChoice) -> None:
        self.agents = agents
        self.requests, self.attempts, self.suites = requests, attempts, suites

    def check_save(self, actor: Actor, reader: Reader) -> ReaderRequest | None:
        if self.allows(actor):
            return None
        requests = tuple(request for request in self.agent_requests(actor)
                         if ReaderSelection.reads_command(reader, request.command, request.category))
        if not requests:
            self.check(actor)
        request = requests[0]
        self.check_attempts(request)
        return request

    def agent_requests(self, actor: Actor) -> tuple[ReaderRequest, ...]:
        if actor.type is not ActorType.AGENT:
            return ()
        agent = self.agents.find(actor.id)
        if agent.role not in self.suites.agent_policy().reader_request_roles:
            return ()
        return self.requests.agent_open_rows(actor.id)

    def check_request(self, actor: Actor, request: ReaderRequest) -> None:
        if self.allows(actor):
            return
        if request not in self.agent_requests(actor):
            raise Refusal("save a reader only for your own open reader request", "read your request before saving")

    def check_attempts(self, request: ReaderRequest) -> None:
        if self.attempts.needs_help(request):
            raise Refusal(f"reader request {request.id} needs the main agent after failed saves", "stop; the main agent is asked to help")

    def check(self, actor: Actor) -> None:
        if self.allows(actor):
            return
        raise Refusal("only the main agent writes readers, and the journal has asked it",
                      "stop, or read on; you are started again once the reader exists")

    def allows(self, actor: Actor) -> bool:
        return actor.type is not ActorType.AGENT or self.agents.is_main(actor.id)
