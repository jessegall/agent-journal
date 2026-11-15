from core.modules.processes.support.cadence.cadence_messages import CadenceMessages


class WarnCadenceHandler:
    def __init__(self, nudger) -> None:
        self.message_sender = nudger

    def handle(self, command, context):
        notice = CadenceMessages.notice(command.kind, command.process, command.part, command.seconds, command.limit)
        # @righteous architecture_processes_reading_nudge_outside_the_notices
        self.message_sender.send(command.agent_id, notice.declaration, "samples.cadence", context, **notice.fields)
