from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.time.clock import Clock
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.support.held_runs import HeldRuns
from core.modules.processes.support.reader_block_keys import ReaderBlockKeys
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts


class ListHoldsSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal process holds [--agent <n>]`: the reading holds on an agent, yours unless named, each with its
    exits: a run held for printing nothing, and the blocks of reader requests."""

    cli_name = "process"
    name = "holds"
    outward = True

    def __init__(self, held_runs: HeldRuns, queries: Queries, numbers: RowNumbers, clock: Clock) -> None:
        self.held_runs, self.queries, self.numbers, self.clock = held_runs, queries, numbers, clock

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int, help="the number of the agent; yours when left out")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        agent_id = self.numbers.row_id(AGENT_MODEL_NAME, arguments.agent, caller.environment_id) if arguments.agent is not None else caller.actor.id
        held = self.held_runs.found(agent_id, self.clock.timestamp())
        lines = [f"hold on output {held.process.id}: {ExitTexts.sentences(PressureLevel.HOLD.exits)}"] if held is not None else []
        blocks = self.queries.query(AgentBlock).filter(session_agent_id=agent_id, closed_at=None).all_rows()
        requests = [request_id for request_id in (ReaderBlockKeys.request_id(block.nudge_key) for block in blocks) if request_id is not None]
        lines += [f"block of reader request {request_id}: {ExitTexts.sentences(PressureLevel.BLOCK.exits)}" for request_id in requests]
        return tuple(lines)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, tuple):
            for line in value or ("no hold",):
                output.line(line)
