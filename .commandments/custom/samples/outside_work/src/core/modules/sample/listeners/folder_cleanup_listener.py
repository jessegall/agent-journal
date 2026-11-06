# @righteous architecture_core_handler_runs_twice
class FolderCleanupListener(SaveListener[Moved[Sample]]):
    transactional = False

    def __init__(self, group: ProcessGroup) -> None:
        self.group = group

    def handle(self, event):
        self.group.stop()
