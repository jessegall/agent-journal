# @sin architecture_core_handler_runs_twice
class SampleKillListener(SaveListener[Moved[Sample]]):
    def __init__(self, group: ProcessGroup) -> None:
        self.group = group

    def handle(self, event):
        self.group.stop()
