from argparse import ArgumentParser, Namespace

from engine.agent_step.stack_codec import StackCodec
from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.agent_stack_move import AgentStackMove

MOVES_SHOWN = 20


class DriverStackSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal driver stack <agent> [--page n]`: an agent's stack from the bottom with when each frame
    entered, then its moves, newest first, a page at a time."""

    cli_name = "driver"
    name = "stack"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent", type=int)
        parser.add_argument("--page", type=int, default=1)

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        row = self.queries.query(AgentStack).filter(session_agent_id=arguments.agent).first()
        if row is None or not row.has_stacked_states:
            return tuple([f"agent {arguments.agent} has no stack yet: its first step writes it"])
        stacked_states = [f"{type(stacked_state.state).__name__} {stacked_state.state_key.generation} since {stacked_state.entered_at.isoformat()}" for stacked_state in StackCodec.decoded(row.stacked_states)]
        moves = self.queries.query(AgentStackMove).filter(session_agent_id=arguments.agent).newest().page(arguments.page, MOVES_SHOWN)
        return (f"{row.driver_name}, version {row.version}, stops refused {row.stop_refusals}, tool calls refused {row.tool_refusals}", *stacked_states,
                "moves, newest first:", *(f"{move.move_type} {move.stacked_state_key} {move.reason_text}" for move in moves.rows))
