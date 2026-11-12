from engine.listener.commit.commit_listener import CommitListener
from core.modules.processes.support.process_nudges import READER_MISSED


class SparseListener(CommitListener):
    def __init__(self, nudger) -> None:
        self.nudger = nudger

    def handle(self, event):
        # @sin architecture_processes_reading_nudge_outside_the_notices
        self.nudger.send(event.agent_id, READER_MISSED, "samples.sparse", event.context, reader=event.reader, output=event.output)
