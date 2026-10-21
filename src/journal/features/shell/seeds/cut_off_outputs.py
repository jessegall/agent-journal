import time

from journal.features.seed import Seed
from journal.repositories.command_outputs import CommandOutputs
from journal.support.actor import Actor


class CutOffOutputs(Seed):
    """At boot, a command moved to the background and not ended was cut off with the server that ran it, since its chain ran inside that server: it is recorded as ended so, and its agent is told once, as any other end."""

    def __init__(self, outputs: CommandOutputs) -> None:
        self.outputs = outputs

    def run(self) -> None:
        for output in self.outputs.moved_unended():
            self.outputs.save(output.interrupted(time.time()), Actor.system())
