from engine.listener.commit.commit_listener import CommitListener
from core.modules.processes.support.reader_selection import ReaderSelection


class ChosenReaderListener(CommitListener):
    def handle(self, event):
        # @sin architecture_processes_reading_judged_outside_the_decider
        return ReaderSelection.choose(event.readers, event.parts, event.layers)
