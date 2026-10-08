from itertools import takewhile

from engine.events.agents import AgentReported
from engine.events.engine import AgentMessageSent, ClockTicked
from engine.events.resources import MessageCreated
from engine.transcript import IDLE as AGENT_IDLE
from features import actions, trigger, watched
from features.nudges.sending import Nudge, Sent, send
from features.parts import ANY_BUT_POST_TOOL_USE, AgentContext, Context, Handler, ToolInterceptor
from engine.gates import Runs
from features.recital import COMMANDS, mentioned, searched
from features.triggers.controller import Triggers, holding
from features.triggers.resource import DENY, FROM_USER, HOLD, IDLE, INSTRUCT, MESSAGE, NUDGE, START, WORKING, Trigger
from resources.base import SYSTEM, USER
from engine.reach import Reach
from controllers.types import Agents, Messages

WATCHING = "watching"
CHAT_DENIED = "caught a denied word in the agent's message"
DONE = {MESSAGE: "sent a message", NUDGE: "nudged the agent", INSTRUCT: "instructed the agent", DENY: "denied the call", START: "started its sequence", HOLD: "held the agent"}


def standing(context) -> list:
    return context.journal.acting(SYSTEM).get(Triggers).rows.standing()


def firing(context, text_of, from_user: bool = False) -> list:
    return [row for row in standing(context)
            if not row.is_state and (from_user or row.words_in != FROM_USER) and mentioned(row.words, text_of(str(row.words_in or "both")))]


def fire(context, agent, row, done: str = "", about: str = "") -> None:
    if row.does != START:
        context.journal.acting(SYSTEM).get(Agents).card(agent.n, label=f"Trigger {row.title} {done or DONE[row.does]}", icon=Trigger.icon,
                                                   tone="danger" if row.does == DENY else "note", title=row.wording, ref=row.ref)
    if row.does == MESSAGE:
        actions.post_as_user(context, row.title, row.brief or row.text, trigger=row.n)
    elif row.does in (NUDGE, INSTRUCT):
        actions.say(context, agent, row.does, title=row.title, text=row.wording)
    Triggers(context.record, actor=SYSTEM).fired(row.n, about)


def in_state(row, agent) -> bool:
    return {IDLE: agent.status == AGENT_IDLE, WORKING: agent.status != AGENT_IDLE}.get(str(row.only_when), True)


def current(row, context, agent) -> list[Sent]:
    if not in_state(row, agent):
        return []
    return watched.found(str(row.fact), context, agent, row.over)


def nudge_of(row) -> Nudge:
    def about(context, agent) -> list[Sent]:
        return [Sent(f"{row.n}:{found.key}", {**found.values, "title": row.title, "text": watched.filled(row.wording, found.values)}) for found in current(row, context, agent)]

    cadence = trigger.Trigger(unit=trigger.MINUTES, every=row.timing) if row.timing else trigger.NEVER
    return Nudge(str(row.does), WATCHING, about, private=True, once=not row.timing, most=int(row.most), timing=cadence)


def state_nudges(context) -> tuple:
    return tuple(nudge_of(row) for row in standing(context) if row.is_state and row.does in (NUDGE, INSTRUCT))


class SayWhatTheJournalShowsOnTheClock(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        send(context, state_nudges(context))


class SayWhatTheJournalShowsOnToolUse(Handler):
    hooks = ANY_BUT_POST_TOOL_USE

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        send(context, state_nudges(context))


class HoldWhileTheJournalShows(Handler):
    behaviour = WATCHING

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        for row in standing(context):
            if not row.is_state or row.does != HOLD:
                continue
            found = current(row, context, context.agent.row)
            if not found:
                context.release(holding(row.n))
                continue
            context.hold("held", holding(row.n), title=row.title, text=watched.filled(row.wording, found[0].values))


class DenyWhatTheAgentDoes(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.SYNC
    behaviour = WATCHING

    def intercept(self, context: AgentContext, call) -> str:
        row = next((row for row in firing(context, lambda scope: searched(call, scope)) if row.does == DENY), None)
        if row is None:
            return ""
        fire(context, context.agent.row, row)
        return f"{row.title} - {row.wording or 'this call is denied by a trigger'}"


class WatchWhatTheAgentDoes(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.ASYNC
    behaviour = WATCHING

    def intercept(self, context: AgentContext, call) -> str:
        for row in takewhile(lambda row: row.does != DENY, firing(context, lambda scope: searched(call, scope))):
            fire(context, context.agent.row, row)
        return ""


class WatchWhatTheAgentWrites(Handler):
    behaviour = WATCHING

    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        for row in firing(context, lambda scope: "" if scope == COMMANDS else event.text):
            fire(context, context.agent.row, row, CHAT_DENIED if row.does == DENY else "")
            if row.does == DENY:
                context.agent.whisper("denied", title=row.title, text=row.wording)


class WatchWhatTheUserWrites(Handler):
    behaviour = WATCHING

    def handle(self, context: Context, event: MessageCreated) -> None:
        if event.actor != USER:
            return
        agent = context.journal.acting(SYSTEM).get(Agents).primary()
        message = context.journal.get(Messages).load(event.n)
        if message.data.get("trigger"):
            return
        text = f"{message.title} {message.brief}"
        for row in firing(context, lambda scope: "" if scope == COMMANDS else text, from_user=True):
            if agent and row.does != DENY:
                fire(context, agent, row, about=f"message:{message.n}")
