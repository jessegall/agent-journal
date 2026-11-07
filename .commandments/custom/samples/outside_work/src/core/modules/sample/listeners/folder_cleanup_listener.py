# @righteous architecture_core_handler_runs_twice
class FolderCleanupListener(CommitListener[Moved[Sample]]):
    def __init__(self, group: ProcessGroup) -> None:
        self.group = group

    def handle(self, event):
        self.group.stop()
