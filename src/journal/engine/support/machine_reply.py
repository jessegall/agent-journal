from dataclasses import dataclass

from journal.models.agent import Agent
from journal.support.decision import Decision


@dataclass(frozen=True)
class MachineReply:
    """What the state machine answers an event with, delivering nothing itself: the agent as it now stands, the decision for the hook, the lines to type into its terminal, the remarks to queue for it, and the moves the states entering and leaving the stack asked of its terminal."""

    agent: Agent
    decision: Decision
    keystrokes: tuple[str, ...] = ()
    remarks: tuple[str, ...] = ()
    moves: tuple[str, ...] = ()

    def merged(self, later: "MachineReply") -> "MachineReply":
        return MachineReply(later.agent, self.decision.merged(later.decision), (*self.keystrokes, *later.keystrokes), (*self.remarks, *later.remarks), (*self.moves, *later.moves))
