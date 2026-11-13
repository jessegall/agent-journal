from engine.container.container import Container
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from server.work.round_work import RoundWork


class ListenerWork(RoundWork):
    """The listener thread's round: the commit listeners run on the events logged since the last round."""

    def run(self, container: Container) -> None:
        container.get(CommitListenerRunner).run()
