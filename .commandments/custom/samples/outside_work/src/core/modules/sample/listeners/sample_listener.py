# @sin architecture_core_handler_runs_twice
class SampleKillListener(SaveListener[Moved[Sample]]):
    def __init__(self, group: ProcessGroup) -> None:
        self.group = group


# @righteous architecture_core_handler_runs_twice
class SampleCommitKillListener(CommitListener[Moved[Sample]]):
    def __init__(self, group: ProcessGroup) -> None:
        self.group = group
