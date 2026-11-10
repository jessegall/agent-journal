from argparse import ArgumentParser, Namespace
from pathlib import Path

from core.modules.messages.support.recent_conversation import SHOWN_CHARACTERS
from engine.caller.caller import Caller
from core.base.provider.providers import Providers
from core.base.provider.transcript_row import TranscriptRow
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.environments.models.environment import Environment

SHOWN_MESSAGES = 10


class UsageOwnMessagesSubcommand(ReadSubcommand[tuple[TranscriptRow, ...]]):
    """`journal usage own-messages`: the last ten messages the agent wrote, from the text of its session file and of
    the session a clear ended."""

    cli_name = "usage"
    name = "own-messages"

    def __init__(self, queries: Queries, providers: Providers, hook_calls: HookCallQuery) -> None:
        self.queries, self.providers, self.hook_calls = queries, providers, hook_calls

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def read(self, arguments: Namespace, caller: Caller) -> tuple[TranscriptRow, ...]:
        if caller.read_actor_id is None:
            return ()
        agent = self.queries.query(Agent).find(caller.read_actor_id)
        folder = Path(self.queries.query(Environment).find(agent.environment_id).folder)
        provider = self.providers.provider(agent.program)
        session_end = self.hook_calls.latest_session_end(agent.id)
        previous_replies = provider.agent_replies(folder, session_end.ended_session, SHOWN_MESSAGES) if session_end is not None and session_end.ended_session != agent.session else ()
        return (*previous_replies, *provider.agent_replies(folder, agent.session, SHOWN_MESSAGES))[-SHOWN_MESSAGES:]

    def write_output(self, value: object, output: Output) -> None:
        rows = [row for row in value if isinstance(row, TranscriptRow)] if is_tuple(value) else []
        output.write("\n".join(f"{row.time}  {' '.join(row.text.split())[:SHOWN_CHARACTERS]}" for row in rows) or "no messages of yours in the transcript", {"rows": [{"time": row.time, "text": row.text} for row in rows]})
