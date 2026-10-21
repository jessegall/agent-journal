from journal.engine.nudge import Nudge


class Engine:
    """The engine's own lines, owned by no feature, so no switch silences them."""

    COMPACTION_PAUSE = Nudge("engine", "nothing_while_compacting", "the context is being compacted: every tool waits until it has ended", "run nothing until the compaction has ended; the journal lets you go on then", repeat_interval=0)
