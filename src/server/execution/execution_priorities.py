from engine.enums.execution_source import ExecutionSource
from engine.enums.starter_type import StarterType
from engine.enums.window_priority import WindowPriority
from engine.execution.execution_classes import ExecutionClasses
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject
from engine.execution.execution_ticket import ExecutionTicket
from engine.time.timestamp import Timestamp
from server.execution.session_starters import SessionStarters

JOURNAL = ExecutionStarter(StarterType.JOURNAL)
PERSON = ExecutionStarter(StarterType.PERSON)


class NoPersonClasses:
    """The instant lane takes the built-in classes only: a person's class names a shell line or a plugin."""

    def classes(self) -> tuple:
        return ()


class ExecutionPriorities:
    """Gives each hook, command, viewer request, tick, listener event and piece of release work its ticket: its
    class from the built-in table and its starter as the server finds it, never as the sender says."""

    def __init__(self, starters: SessionStarters) -> None:
        self.starters, self.classes = starters, ExecutionClasses(NoPersonClasses())

    def hook_ticket(self, session: str, event_name: str, entered_at: Timestamp) -> ExecutionTicket:
        return self.ticket(ExecutionSubject(ExecutionSource.HOOK, self.starters.starter(session) if session else JOURNAL, line=event_name), entered_at)

    def command_ticket(self, session: str, line: str, entered_at: Timestamp) -> ExecutionTicket:
        return self.ticket(ExecutionSubject(ExecutionSource.COMMAND, self.starters.starter(session), line=line), entered_at)

    def viewer_ticket(self, line: str, window: WindowPriority, entered_at: Timestamp) -> ExecutionTicket:
        return self.ticket(ExecutionSubject(ExecutionSource.VIEWER_REQUEST, PERSON, line=line, is_first_window=window is WindowPriority.FIRST), entered_at)

    def tick_ticket(self, handler_name: str, entered_at: Timestamp) -> ExecutionTicket:
        return self.ticket(ExecutionSubject(ExecutionSource.TICK_HANDLER, JOURNAL, line=handler_name), entered_at)

    def event_ticket(self, event_name: str, entered_at: Timestamp) -> ExecutionTicket:
        return self.ticket(ExecutionSubject(ExecutionSource.LISTENER_EVENT, JOURNAL, line=event_name), entered_at)

    def release_ticket(self, kind: str, entered_at: Timestamp) -> ExecutionTicket:
        return self.ticket(ExecutionSubject(ExecutionSource.RELEASE_WORK, JOURNAL, line=kind), entered_at)

    def ticket(self, subject: ExecutionSubject, entered_at: Timestamp) -> ExecutionTicket:
        execution_class = self.classes.match(subject)
        return ExecutionTicket(execution_class, execution_class.priority, execution_class.priority, subject.starter, subject.line, entered_at, entered_at)
