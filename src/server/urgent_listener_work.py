from engine.container.container import Container
from engine.listener.commit_listener_runner import CommitListenerRunner
from server.round_work import RoundWork


class UrgentListenerWork(RoundWork):
    """The round of the listeners a person waits on, such as those that type a line, on a thread of their own so
    that no other listener holds them up."""

    def run(self, container: Container) -> None:
        container.get(CommitListenerRunner).run_urgent()
