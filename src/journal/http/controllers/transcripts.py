from pathlib import Path

from journal.config import Config
from journal.models.worker import Worker
from journal.support.actor import Actor
from journal.features.workers.support.subagents import Subagents
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.http.support.request import Request
from journal.support.response import Response
from journal.http.transcripts.transcript_page import TranscriptPage
from journal.http.transcripts.transcript_turns import TranscriptTurns
from journal.providers.provider import Provider
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.support.missing_row import MissingRow
from journal.repositories.workers import Workers



class TranscriptController:
    """The conversation of an agent, of one of its subagents and of a worker, read from the provider's own files."""

    def __init__(self, config: Config, providers: Providers, agents: Agents, workers: Workers, subagents: Subagents, runner: WorkerRunner, turns: TranscriptTurns) -> None:
        self.config, self.providers, self.agents, self.workers, self.subagents, self.runner, self.turns = config, providers, agents, workers, subagents, runner, turns

    def agent_transcript(self, request: Request) -> Response:
        agent = self.agents.find(request.number("id"))
        provider = self.providers.lookup(agent.provider)
        return self.answer(request, provider, provider.transcript(self.config.root, agent.session))

    def subagent_transcript(self, request: Request) -> Response:
        agent, id = self.agents.find(request.number("id")), request.params["session"]
        if not any(row.session == id for row in self.subagents.rows(agent.session)):
            raise MissingRow("subagent sessions", id)
        provider = self.providers.lookup(agent.provider)
        return self.answer(request, provider, provider.subagent_transcript(self.config.root, agent.session, id))

    def worker_transcript(self, request: Request) -> Response:
        worker = self.workers.find(request.number("id"))
        provider = self.providers.lookup(worker.provider)
        place = self.runner.place(worker)
        session = worker.resume or worker.recovered_session or self.found_session(worker, provider, place)
        return self.answer(request, provider, provider.transcript(place, session) if session else None)

    def found_session(self, worker: Worker, provider: Provider, place: Path) -> str:
        session = provider.latest_session(place, worker.began) if worker.began else ""
        if session:
            self.workers.touch(worker, Actor.system(), recovered_session=session)
        return session

    def answer(self, request: Request, provider: Provider, path: Path | None) -> Response:
        page = TranscriptPage(self.turns.build(provider, path) if path else [])
        if "entry" in request.query:
            return Response.json(page.entry(int(request.query["entry"])))
        return Response.json(page.page(**{field: int(request.query[key]) for key, field in (("since", "start"), ("before", "previous"), ("last", "size")) if request.query.get(key)}))
