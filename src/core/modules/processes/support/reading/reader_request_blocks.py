from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.agent.agent_role_reader import AgentRoleReader
from engine.driver.hook_event import HookEvent
from engine.request.request_values import RequestValues
from core.modules.drivers.support.minute_tick import MinuteTick
from core.modules.processes.support.reading.reader_request_answer import ReaderHelpHold, ReaderRequestAnswer
from engine.driver.open_hold import OpenHold
from engine.driver.conditions.time_reached import TimeReached
from engine.driver.interval import Interval
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.time.clock import Clock
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.modules.processes.commands.send_reader_request_notice.send_reader_request_notice import SendReaderRequestNotice
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted
from core.modules.processes.support.process_nudges import READER_REQUEST_COUNTDOWN, READER_REQUEST_SPAN
from core.modules.processes.nudges.reader_block_message import ReaderBlockMessage
from core.modules.processes.nudges.reader_request_refusal_message import ReaderRequestRefusalMessage
from core.modules.processes.support.reader_block_keys import ReaderBlockKeys
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.support.reader_request_text import ReaderRequestText
from core.modules.processes.support.reader_save_attempts import ReaderSaveAttempts
from core.modules.processes.support.reader_writers import ReaderWriters


class ReaderRequestBlocks:
    """The blocks of a reader request: the agent that must have the reader is held until the request is completed
    or expires, and the main agent is asked to help after failed saves."""

    def __init__(self, requests: ReaderRequestQuery, request_text: ReaderRequestText, notices: ReaderRequestNotices, writers: ReaderWriters, attempts: ReaderSaveAttempts,
                 bus: Bus, clock: Clock, roles: AgentRoleReader, minute_tick: MinuteTick, request_values: RequestValues) -> None:
        self.requests, self.request_text, self.notices, self.writers, self.attempts = requests, request_text, notices, writers, attempts
        self.bus, self.clock, self.roles, self.minute_tick, self.request_values = bus, clock, roles, minute_tick, request_values

    def request_block(self, process: Process, part: ProcessPart, context: Context) -> None:
        request = self.requests.find(part.reader_request_id)
        if request.completed_at is not None or request.expires_at <= self.clock.timestamp():
            return
        nudge = ReaderBlockMessage.declared().nudge(output=part.process_id, request=request.id)
        ends = AnyCondition(ReaderRequestCompleted(request.id), TimeReached(request.expires_at.text))
        self.bus.dispatch(OpenHold(process.session_agent_id, ReaderBlockKeys.keyed(nudge, request.id), ends), context)

    # what the reader requests say at one hook of the agent, read once a hook; the minute step reads the tick it replaces
    def answer(self, event: HookEvent | None, agent_id: int) -> ReaderRequestAnswer:
        hook_event = event if event is not None else self.minute_tick.event(agent_id)
        return self.request_values.read(f"processes.reader-requests:{agent_id}:{hook_event.firing}", lambda: hook_event.firing, lambda: self.found(hook_event, agent_id))

    def found(self, event: HookEvent, agent_id: int) -> ReaderRequestAnswer:
        if not event.accepts_lines:
            return ReaderRequestAnswer()
        if self.roles.role(agent_id) != AgentRole.MAIN:
            return ReaderRequestAnswer(tuple(self.request_text.line(request) for request in self.writers.agent_requests(Actor(agent_id, ActorType.AGENT))))
        now = self.clock.timestamp()
        waiting = tuple(request for request in self.requests.open_rows()
                        if (self.attempts.needs_help(request) or request.expires_at <= now)
                        if not self.notices.has_recent_notice(agent_id, request.id, now))
        holds = tuple(self.help_hold(request) for request in waiting)
        if event.event is HookEventName.TICK:
            return ReaderRequestAnswer((), holds, tuple(SendReaderRequestNotice(agent_id, request.id) for request in waiting))
        return ReaderRequestAnswer(tuple(self.request_text.line(request) for request in waiting), holds)

    # the hold that asks the main agent to help with a request whose saves failed or that expired
    @staticmethod
    def help_hold(request: ReaderRequest) -> ReaderHelpHold:
        refusal = ReaderRequestRefusalMessage.declared().nudge(request=request.id, command=request.command, block="{block}")
        return ReaderHelpHold(ReaderBlockKeys.keyed(refusal, request.id), ReaderRequestCompleted(request.id), request.command)

    @staticmethod
    def help_block(agent_id: int, hold: ReaderHelpHold) -> OpenHold:
        return OpenHold(agent_id, hold.nudge, hold.condition, after=Interval(READER_REQUEST_SPAN), countdown=READER_REQUEST_COUNTDOWN.nudge("{left}", command=hold.command))
