from engine.container.container import Container
from core.base.listener.commit_listener_runner import CommitListenerRunner
from server.round_work import RoundWork


class ProgramStopListenerWork(RoundWork):
    """The round of the thread that stops programs in a running server: a stop waits on a launcher or a process for
    seconds, so it holds no other commit listener."""

    def run(self, container: Container) -> None:
        container.get(CommitListenerRunner).run_program_stops()
