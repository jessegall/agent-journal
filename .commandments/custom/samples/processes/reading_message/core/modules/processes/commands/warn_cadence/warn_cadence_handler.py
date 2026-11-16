from core.modules.processes.support.cadence.cadence_messages import CadenceMessages


class WarnCadenceHandler:
    def __init__(self, message_sender) -> None:
        self.message_sender = message_sender

    def handle(self, command, context):
        notice = CadenceMessages.notice(command.kind, command.process, command.part, command.seconds, command.limit)
        # @righteous architecture_processes_reading_message_outside_the_notices
        self.message_sender.send(command.agent_id, notice.declaration, "samples.cadence", context, **notice.fields)
