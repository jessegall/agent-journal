import threading
from functools import cache

from engine.database.actor_table import ActorTable
from engine.database.database import Database
from engine.enums.agent_role import AgentRole
from engine.enums.starter_type import StarterType
from engine.execution.execution_starter import ExecutionStarter
from engine.journal.journal_home import JournalHome

PERSON = ExecutionStarter(StarterType.PERSON)


class SessionStarters:
    """Who started a hook or a command, found by the server from the agents table by its session, never taken
    from what the sender says: each session is read once on a connection of its own and kept. A session no agent
    row has yet counts as the main agent, so the first hook of a new session passes, and is read again next time."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.known: dict[str, ExecutionStarter] = {}
        self.lock = threading.Lock()
        self.database: Database | None = None

    # one record for each journal a server process serves, shared by every request thread
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "SessionStarters":
        return SessionStarters(home)

    def starter(self, session: str) -> ExecutionStarter:
        if not session:
            return PERSON
        with self.lock:
            if session in self.known:
                return self.known[session]
            role = ActorTable(self.connection()).session_role(session)
            if role is None:
                return ExecutionStarter(StarterType.MAIN_AGENT)
            found = ExecutionStarter(StarterType.MAIN_AGENT) if role == AgentRole.MAIN else ExecutionStarter(StarterType.HELPER, agent_role=role)
            self.known[session] = found
            return found

    def role(self, session: str) -> str:
        starter = self.starter(session)
        return starter.agent_role or AgentRole.MAIN if starter.starter_type is StarterType.HELPER else AgentRole.MAIN

    def connection(self) -> Database:
        if self.database is None:
            self.database = Database.shared(self.home)
        return self.database

    # the server's stop closes the connection; a later read opens one again
    def close(self) -> None:
        with self.lock:
            if self.database is not None:
                self.database.close()
                self.database = None
