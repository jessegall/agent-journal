from core.modules.processes.support.cadence.cadence_nudges import CadenceNudges


class WarnCadenceHandler:
    def __init__(self, nudger) -> None:
        self.nudger = nudger

    def handle(self, command, context):
        notice = CadenceNudges.notice(command.kind, command.process, command.part, command.seconds, command.limit)
        # @righteous architecture_processes_reading_nudge_outside_the_notices
        self.nudger.send(command.agent_id, notice.declaration, "samples.cadence", context, **notice.fields)
