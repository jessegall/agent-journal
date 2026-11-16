from engine.listener.commit.commit_listener import CommitListener
from core.modules.processes.support.process_agent_messages import READER_MISSED


class SparseListener(CommitListener):
    def __init__(self, message_sender) -> None:
        self.message_sender = message_sender

    def handle(self, event):
        # @sin architecture_processes_reading_message_outside_the_notices
        self.message_sender.send(event.agent_id, READER_MISSED, "samples.sparse", event.context, reader=event.reader, output=event.output)
