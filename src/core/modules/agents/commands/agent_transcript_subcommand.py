from argparse import ArgumentParser, Namespace
from pathlib import Path

from core.base.caller.caller import Caller
from core.base.page import Page
from core.base.provider.providers import Providers
from core.base.provider.transcript_row import TranscriptRow
from core.base.query.queries import Queries
from core.base.subcommand.page_arguments import page_arguments
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment


class AgentTranscriptSubcommand(ReadSubcommand[Page[TranscriptRow]]):
    """`journal agent transcript <agent>`: the agent program's conversation, from the session file its
    provider names, the newest rows last."""

    cli_name = "agent"
    name = "transcript"

    def __init__(self, queries: Queries, providers: Providers) -> None:
        self.queries, self.providers = queries, providers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        page_arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> Page[TranscriptRow]:
        agent = self.queries.query(Agent).find(arguments.agent_id)
        folder = Path(self.queries.query(Environment).find(agent.environment_id).folder)
        provider = self.providers.provider(agent.program)
        path = provider.transcript(folder, agent.session)
        rows = tuple(provider.transcript_rows(path)) if path is not None else ()
        end = max(len(rows) - (arguments.page - 1) * arguments.limit, 0)
        return Page(rows[max(end - arguments.limit, 0):end], arguments.page, arguments.limit, len(rows))
