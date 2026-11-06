# @sin architecture_core_handler_runs_twice
class FolderRemovalGuard(Guard):
    name = "samples.folder-removal"

    def __init__(self, group: ProcessGroup) -> None:
        self.group = group

    def check(self, command, context):
        self.group.stop()
