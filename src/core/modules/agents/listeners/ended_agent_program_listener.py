from engine.event.event_log import EventLog
from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.listener.commit_listener_runner import PROGRAM_STOP_RUN_ORDER
from engine.scope.actor_scope import ActorScope
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.agents.models.agent import AGENTS_TABLE, PID_FIELD, Agent

SESSION_FIELD = "session"
PROGRAM_FIELD = "program"
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from core.modules.agents.support.agent_program import AgentProgram
from core.modules.agents.commands.start_agent.start_agent import StartAgent


class EndedAgentProgramListener(CommitListener[AgentEnded]):
    """Stops the program of an agent that another ended, after the commit, so no hook waits on a
    process. An agent that ended itself stops by itself, a row reopened since runs a new program, and
    StopAgent stopped its own. A resumed agent keeps its row ended until its first hook, so a process
    recorded after the end, or a launch that holds the session's lock, is a new program; the launch's
    own prepare step has dealt with the old one. A row that another session took over since keeps running
    under the new session, so only the old session's own process is stopped. When the new session started in a
    terminal of its own, the launcher's terminal of the agent can only hold the old session and is asked to stop;
    after a launch it holds the new one and is left alone."""

    name = "agents.ended-agent-program"
    run_order = PROGRAM_STOP_RUN_ORDER
    disabled_scopes = [ActorScope]

    def __init__(self, program: AgentProgram, log: EventLog, sessions: AgentLaunchGuard) -> None:
        self.program, self.log, self.sessions = program, log, sessions

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        if not self.needs_stop(event.row, logged):
            return
        with self.sessions.lock(event.row.session) as available:
            if available:
                self.stop_program(event.row, [later for later in self.log.row_events(AGENTS_TABLE, event.row.id) if later.id > logged.id])

    @staticmethod
    def needs_stop(agent: Agent, logged: LoggedEvent) -> bool:
        return logged.actor_id != agent.id and logged.command != StopAgent.label()

    def stop_program(self, agent: Agent, later_events: list[LoggedEvent]) -> None:
        new_session = next((later for later in later_events if SESSION_FIELD in later.data), None)
        if new_session is not None:
            self.program.stop_process(self.earlier_value(new_session, PID_FIELD, agent.pid), self.earlier_value(new_session, PROGRAM_FIELD, agent.program))
            if new_session.command == StartAgent.label():
                self.program.request_stop(agent)
        elif agent.ended_at is not None and not any(PID_FIELD in later.data for later in later_events):
            self.program.stop(agent)

    @staticmethod
    def earlier_value(changed: LoggedEvent, field: str, unchanged_value):
        return changed.data[field][0] if field in changed.data else unchanged_value
