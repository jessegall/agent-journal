class WorktreeFailure(Exception):
    """git refused to make the worktree a launch asked for, with what git said."""

    def __init__(self, name: str, line_text: str) -> None:
        super().__init__(f"the worktree {name} could not be made: {line_text}")
