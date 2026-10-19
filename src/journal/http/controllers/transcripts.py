from pathlib import Path

from journal.config import Config
from journal.features.workers.subagents import Subagents
from journal.features.workers.worker_runner import WorkerRunner
from journal.http.request import Request
from journal.http.response import Response
from journal.http.transcripts.transcript_page import TranscriptPage
from journal.providers.provider import Provider
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.not_found import NotFound
from journal.repositories.workers import Workers



class TranscriptController:
    """The conversation of an agent, of one of its subagents and of a worker, read from the provider's own files."""

    def __init__(self, config: Config, providers: Providers, agents: Agents, workers: Workers, subagents: Subagents, runner: WorkerRunner) -> None:
        self.config, self.providers, self.agents, self.workers, self.subagents, self.runner = config, providers, agents, workers, subagents, runner

    def of_agent(self, request: Request) -> Response:
        agent = self.agents.find(request.number("id"))
        provider = self.providers.named(agent.provider or "claude")
        return self.answer(request, provider, provider.transcript(self.config.root, agent.session))

    def of_subagent(self, request: Request) -> Response:
        agent, id = self.agents.find(request.number("id")), request.params["session"]
        if not any(row.session == id for row in self.subagents.rows(agent.session)):
            raise NotFound("subagent sessions", id)
        provider = self.providers.named(agent.provider or "claude")
        return self.answer(request, provider, provider.subagent_transcript(self.config.root, agent.session, id))

    def of_worker(self, request: Request) -> Response:
        worker = self.workers.find(request.number("id"))
        provider = self.providers.named(worker.provider)
        return self.answer(request, provider, provider.transcript(self.runner.place(worker), worker.resume) if worker.resume else None)

    @staticmethod
    def answer(request: Request, provider: Provider, path: Path | None) -> Response:
        page = TranscriptPage(provider.turns(path) if path else [])
        if "entry" in request.query:
            return Response.json(page.entry(int(request.query["entry"])))
        return Response.json(page.page(**{field: int(request.query[key]) for key, field in (("since", "since"), ("before", "before"), ("last", "size")) if request.query.get(key)}))
