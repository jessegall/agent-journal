from engine.database.row_history import RowHistory
from engine.event.event_log import EventLog
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.commit.commit_listener_runner import PROGRAM_STOP_RUN_ORDER
from engine.scope.actor_scope import ActorScope
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from core.modules.agents.commands.stop_agent_program.stop_agent_program import StopAgentProgram
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.agents.models.agent import AGENTS_TABLE, PID_FIELD, Agent

SESSION_FIELD = "session"
PROGRAM_FIELD = "program"
STOP_COMMANDS = (StopAgent.label(), StopAgentProgram.label())
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from core.modules.agents.support.agent_program import AgentProgram
from core.modules.agents.commands.start_agent.start_agent import StartAgent


class EndedAgentProgramListener(CommitListener[AgentEnded]):
    """Stops the program of an agent that another ended, after the commit, so no hook waits on a process. An
    agent that ended itself stops by itself, a row reopened since runs a new program, and StopAgent and
    StopAgentProgram stopped the program themselves. A resumed agent keeps its row ended until its first
    hook, so a process recorded after the end, or a launch that has the session's lock, is a new program;
    the launch's own prepare step has dealt with the old one. A row that another session took over since
    keeps running under the new session, so only the old session's own process is stopped. When the new
    session started in a terminal of its own, the launcher's terminal of the agent can only run the old
    session and is asked to stop; after a launch it runs the new one and is left alone."""

    name = "agents.ended-agent-program"
    run_order = PROGRAM_STOP_RUN_ORDER
    disabled_scopes = [ActorScope]

    def __init__(self, program: AgentProgram, log: EventLog, policy: DispatchPolicy) -> None:
        self.program, self.log, self.policy = program, log, policy

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        if not self.needs_stop(event.row, logged):
            return
        with self.policy.lock(event.row.session) as available:
            if available:
                self.stop_program(event.row, self.log.row_events_past(RowHistory(AGENTS_TABLE, event.row.id), logged.id))

    @staticmethod
    def needs_stop(agent: Agent, logged: LoggedEvent) -> bool:
        return logged.actor_id != agent.id and logged.command not in STOP_COMMANDS

    def stop_program(self, agent: Agent, later_events: list[LoggedEvent]) -> None:
        new_session = next((later for later in later_events if SESSION_FIELD in later.data), None)
        if new_session is not None:
            self.program.stop_process(self.earlier_pid(new_session, agent.pid), self.earlier_program(new_session, agent.program))
            if new_session.command == StartAgent.label():
                self.program.request_stop(agent)
        elif agent.ended_at is not None and not any(PID_FIELD in later.data for later in later_events):
            self.program.stop(agent)

    @staticmethod
    def earlier_pid(changed: LoggedEvent, unchanged_pid: int | None) -> int | None:
        if PID_FIELD not in changed.data:
            return unchanged_pid
        previous_pid = changed.data[PID_FIELD][0]
        return int(str(previous_pid)) if previous_pid is not None else None

    @staticmethod
    def earlier_program(changed: LoggedEvent, unchanged_program: str) -> str:
        return str(changed.data[PROGRAM_FIELD][0]) if PROGRAM_FIELD in changed.data else unchanged_program
