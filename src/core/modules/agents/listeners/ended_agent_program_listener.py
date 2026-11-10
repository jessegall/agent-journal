from engine.event.event_log import EventLog
from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.listener.commit_listener_runner import PROGRAM_STOP_RUN_ORDER
from engine.scope.actor_scope import ActorScope
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from core.modules.agents.events.agent_ended import AgentEnded
from core.modules.agents.models.agent import AGENTS_TABLE, PID_FIELD, Agent
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from core.modules.agents.support.agent_program import AgentProgram


class EndedAgentProgramListener(CommitListener[AgentEnded]):
    """Stops the program of an agent that another ended, after the commit, so no hook waits on a
    process. An agent that ended itself stops by itself, a row reopened since runs a new program, and
    StopAgent stopped its own. A resumed agent keeps its row ended until its first hook, so a process
    recorded after the end, or a launch that holds the session's lock, is a new program; the launch's
    own prepare step has dealt with the old one."""

    name = "agents.ended-agent-program"
    run_order = PROGRAM_STOP_RUN_ORDER
    disabled_scopes = [ActorScope]

    def __init__(self, program: AgentProgram, log: EventLog, sessions: AgentLaunchGuard) -> None:
        self.program, self.log, self.sessions = program, log, sessions

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        if not self.needs_stop(event.row, logged):
            return
        with self.sessions.lock(event.row.session) as available:
            if available and not self.started_after_end(event.row, logged):
                self.program.stop(event.row)

    @staticmethod
    def needs_stop(agent: Agent, logged: LoggedEvent) -> bool:
        return logged.actor_id != agent.id and agent.ended_at is not None and logged.command != StopAgent.label()

    def started_after_end(self, agent: Agent, logged: LoggedEvent) -> bool:
        return any(event.id > logged.id and PID_FIELD in event.data for event in self.log.row_events(AGENTS_TABLE, agent.id))
