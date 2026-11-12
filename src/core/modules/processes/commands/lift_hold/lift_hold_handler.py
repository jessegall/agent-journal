from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.processes.commands.lift_hold.lift_hold import LiftHold
from core.modules.processes.support.cadence.run_silences import LOOKED_MARK
from core.modules.processes.support.held_runs import HeldRuns
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import BLOCK_LIFTED, HOLD_LIFTED, READER_BLOCK, READER_REQUEST_REFUSAL

SOURCE = "processes.hold-lifted"
READING_BLOCK_KEYS = (READER_BLOCK.key, READER_REQUEST_REFUSAL.key)


class LiftHoldHandler(Handler[LiftHold, int]):
    """Lifts the reading holds on an agent for the person who pressed the agent card's button: the run it is held
    on counts as read, each block of a reader request is closed, and the agent is told once for each."""

    command = LiftHold

    def __init__(self, queries: Queries, held_runs: HeldRuns, folder: OutputFolder, bus: Bus, nudger: Nudger) -> None:
        self.queries, self.held_runs, self.folder, self.bus, self.nudger = queries, held_runs, folder, bus, nudger

    def handle(self, command: LiftHold, context: Context) -> int:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only a person lifts a hold, on the agent's card", "take the exit the hold names")
        lifted = 0
        held = self.held_runs.found(command.agent_id, context.timestamp)
        if held is not None:
            self.folder.write_read_mark(held.process.id, LOOKED_MARK, context.timestamp.text)
            self.nudger.send(command.agent_id, HOLD_LIFTED, SOURCE, context, output=held.process.id)
            lifted += 1
        blocks = self.queries.query(AgentBlock).filter(session_agent_id=command.agent_id, closed_at=None).all_rows()
        for block in (block for block in tuple(blocks) if block.nudge_key.startswith(READING_BLOCK_KEYS)):
            self.bus.dispatch(CloseAgentBlock(block.id), context)
            self.nudger.send(command.agent_id, BLOCK_LIFTED, SOURCE, context, request=int(block.nudge_key.rsplit(".", 1)[-1]))
            lifted += 1
        return lifted
