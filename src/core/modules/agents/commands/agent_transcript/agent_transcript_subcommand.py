from argparse import ArgumentParser, Namespace
from dataclasses import replace
from pathlib import Path

from engine.caller.caller import Caller
from engine.row.page import Page
from core.base.provider.providers import Providers
from core.base.provider.transcript_index import TranscriptIndex
from core.base.provider.transcript_row import TranscriptRow
from engine.query.queries import Queries
from engine.subcommand.page_arguments import page_arguments
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.transcript_authors import TranscriptAuthors
from core.modules.environments.models.environment import Environment


class AgentTranscriptSubcommand(ReadSubcommand[Page[TranscriptRow]]):
    """`journal agent transcript <agent>`: the agent program's conversation, from the session file its
    provider names, the newest rows last; --before-id reads the page of rows before a row."""

    cli_name = "agent"
    name = "transcript"

    def __init__(self, queries: Queries, providers: Providers, index: TranscriptIndex, authors: TranscriptAuthors) -> None:
        self.queries, self.providers, self.index, self.authors = queries, providers, index, authors

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        page_arguments(parser)
        parser.add_argument("--before-id", type=int, default=None)

    def read(self, arguments: Namespace, caller: Caller) -> Page[TranscriptRow]:
        agent = self.queries.query(Agent).find(arguments.agent_id)
        folder = Path(self.queries.query(Environment).find(agent.environment_id).folder)
        provider = self.providers.provider(agent.program)
        path = provider.transcript(folder, agent.session)
        if path is None:
            return Page((), arguments.page, arguments.limit, 0)
        if arguments.before_id is not None:
            page = self.index.older_rows(provider, path, arguments.before_id, arguments.limit)
        else:
            page = self.index.page(provider, path, arguments.page, arguments.limit)
        return replace(page, rows=self.authors.tagged(agent, page.rows))
