from features.base import Feature
from features.statusline.group import grouped, ran
from features.statusline.queue import queue


def bar(row, now: float = 0.0) -> dict:
    return {"queue": queue(grouped(ran(row.commands)), now)}


class StatusLine(Feature):
    name = "statusline"
    title_ = "What the status bar shows"
    abstract_ = "The journal says what the bar shows, in a queue of messages, and the viewer renders them in turn"
    help_ = "Four stages, one after the other: the provider records every command that runs on the agent's ring; dissect takes one apart into its kind and the names it worked on; group joins consecutive commands of the same kind; queue turns each group into a status message with its verb, its rolling parts, its counts and how long it stays. The viewer plays the queue and decides nothing of its own. The sample run, tests/features/statusline/samples.py, drives thousands of real commands through the hooks and plays every queue; it is slow, so it is not named test_ and is run by hand when the bar changes."
