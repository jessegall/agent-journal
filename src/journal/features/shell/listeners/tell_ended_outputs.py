from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.features.shell.support.output_files import OutputFiles
from journal.models.command_output import CommandOutput
from journal.repositories.command_outputs import CommandOutputs
from journal.support.actor import Actor
from journal.supervisor_link import SupervisorLink

QUIET_FOR = 5.0
"""Seconds the agent has sent no hook before the commands that ended meanwhile are named, all in one line."""


class TellEndedOutputs(AgentListener[Ticked]):
    """The commands that ended in the background are named to the agent once it is quiet, every one that ended by then in one line, so a busy hour of them is not a line each mid-turn."""

    def __init__(self, outputs: CommandOutputs, machine: Machine, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.outputs, self.machine, self.nudger, self.supervisor = outputs, machine, nudger, supervisor

    def handle(self, event: Ticked) -> None:
        from journal.features.shell.feature import Shell
        ended = self.outputs.ended_untold(event.session)
        if event.quiet_for < QUIET_FOR or not ended:
            return
        for output in ended:
            self.outputs.save(output.told_of(), Actor.system())
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), Shell.ENDED.about(outputs=self.named(ended), n=ended[0].id))
        if line:
            self.supervisor.type(event.environment_id, line)

    @staticmethod
    def named(ended: list[CommandOutput]) -> str:
        """The outputs by how they ended, in the order they ended: output 12 finished; outputs 15, 18 failed with code 1."""
        outcomes: dict[str, list[int]] = {}
        for output in ended:
            outcomes.setdefault(OutputFiles.ended(output.status), []).append(output.id)
        return "; ".join(f"output{'s' if len(ids) > 1 else ''} {', '.join(map(str, ids))} {outcome}" for outcome, ids in outcomes.items())
