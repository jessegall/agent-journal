from engine.container.container import Container
from engine.listener.commit_listener_runner import CommitListenerRunner
from server.work.round_work import RoundWork


class OrdinaryListenerWork(RoundWork):
    """The listener thread's round in a running server: every commit listener but the urgent ones, which have their
    own thread."""

    def run(self, container: Container) -> None:
        container.get(CommitListenerRunner).run_ordinary()
