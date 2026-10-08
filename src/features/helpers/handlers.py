import time

from agents.terminal import Launched, launch_failure, launch_output
from controllers.types import Agents, Messages, Questions
from engine.record import Record
from engine.seats import terminal_of
from engine.events.engine import ClockTicked
from engine.events.resources import AgentChanged, MessageCreated
from engine.sessions import Sessions, alive
from features.ask_questions.handlers import QuestionAsked
from features.helpers.controller import Helpers
from features.helpers.reuse import subagent_rows
from features.parts import AgentContext, Context, Handler, OnAgentUpdated
from features.trigger import MINUTE
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, titled
from resources.types import FAILED


class TellAFailedTurn(Handler):
    def handle(self, context: AgentContext, event: AgentChanged) -> None:
        row = context.agent.row
        if row.event == FAILED:
            Helpers(context.record, actor=SYSTEM)._failed(row.failure)


class TellAFailedTurnOnChange(OnAgentUpdated, TellAFailedTurn):
    pass


def still_unreported(journal, rows: tuple[str, ...]) -> bool:
    return any(row.ref in rows and not (row.report or row.stopped_by_user) for row in journal.get(Helpers).rows.standing())


def report_waits(journal, rows: tuple[str, ...]) -> bool:
    """A helper's report is named while it stands: helper say, which gives the helper new work, clears it, and so does finishing the helper."""
    return any(row.ref in rows and row.report for row in journal.get(Helpers).rows.standing())


def open_questions(root, environment: str) -> list:
    return [question for question in Questions(Record(root, environment), actor=SYSTEM).rows.standing() if not question.hidden]


def helper_waits_on_question(journal, rows: tuple[str, ...]) -> bool:
    helpers = journal.get(Helpers)
    return any(row.ref in rows and open_questions(helpers.record.root, row.environment) for row in helpers.rows.standing())


def listed_options(question) -> str:
    if not question.options:
        return "It offers no options, so answer it in your own words."
    titles = [option["title"] if isinstance(option, dict) else str(option) for option in question.options]
    return "Options: " + "; ".join(f"{at}. {title}{' (its pick)' if question.pick == at else ''}" for at, title in enumerate(titles, 1)) + "."


def subagent_name(record, agent: str) -> str:
    primary = Agents(record, actor=SYSTEM).primary()
    task = next((sub.task for sub in subagent_rows(primary) if sub.address == agent), "") if primary else ""
    return task.partition(":")[0].strip() or agent


class RelayAnswerToDispatcher(Handler):
    """While a helper works a follow-up, a message its agent writes in its own environment reaches the dispatcher's chat as a message from the helper, as its report does."""

    def handle(self, context: Context, event: MessageCreated) -> None:
        helpers = Helpers(context.record, actor=SYSTEM)
        place = helpers._helping()
        if not place or event.actor != AGENT:
            return
        helper = helpers._helper(place)
        written = Messages(context.record, actor=SYSTEM).load(event.n)
        if not helper.answering or written.data.get("from_main") or written.data.get("peer"):
            return
        Messages(Record(context.record.root, place.launched_from), actor=AGENT).create(titled(written.brief), brief=written.brief, peer=helper.name)


class TellAQuestionAskedAway(Handler):
    def handle(self, context: Context, event: QuestionAsked) -> None:
        question = Questions(context.record, actor=SYSTEM).load(event.n)
        helpers = Helpers(context.record, actor=SYSTEM)
        place = helpers._helping()
        if question.hidden or not (place or question.agent):
            return
        if place:
            helper = helpers._helper(place)
            context.feature.to_primary(Record(context.record.root, place.launched_from), "helper asking", who=f"helper {helper.n}, {helper.name}", question=question.n,
                                       text=question.title, options=listed_options(question),
                                       command=f'journal --env "{context.record.env}" question answer {question.n} "<answer>" --set reason="<why>"', rows=[helper.ref])
            return
        context.feature.to_primary(context.record, "subagent asking", who=f"subagent {subagent_name(context.record, question.agent)}", question=question.n,
                                   text=question.title, options=listed_options(question), command=f'journal question answer {question.n} "<answer>" --set reason="<why>"',
                                   rows=[question.ref])


def gone(root, name: str, session) -> bool:
    launched = Launched.read(root, terminal_of(root, name) or name)
    return bool(session.pid) and not alive(session.pid) and not (launched.pid and alive(launched.pid))


def refused_by_provider(root, row) -> str | None:
    """Why the helper's provider refused to run it, as its launch output says, when it did."""
    provider = PROVIDERS.get(row.provider)
    if provider is None:
        return None
    return provider.refusal_in(launch_output(root, row.environment))


class NameStoppedOrQuietHelpers(Handler):
    behaviour = "watch"

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        speaking = context.to_primary()
        if not speaking:
            return
        quiet_after = float(context.settings.quiet_after) * MINUTE
        root = context.record.root
        sessions = Sessions(root).all()
        for row in Helpers(context.record, actor=SYSTEM).rows.standing():
            if row.report or row.stopped_by_user:
                continue
            refusal = refused_by_provider(root, row)
            if refusal is not None:
                if speaking.once("helper refused", f"{row.n}:{refusal}"):
                    speaking.agent.say("refused", n=row.n, name=row.name, provider=row.provider, reason=refusal, rows=[row.ref])
                continue
            theirs = {name: s for name, s in sessions.items() if s.environment == row.environment}
            if not theirs:
                continue
            last_seen = max(s.last_heard for s in theirs.values())
            stopped = all(gone(root, name, s) for name, s in theirs.items())
            if stopped and speaking.once("helper stopped", f"{row.n}:{last_seen}"):
                speaking.agent.say("stopped", n=row.n, name=row.name, cause=launch_failure(context.record.root, row.environment), rows=[row.ref])
            elif not stopped and time.time() - last_seen >= quiet_after and speaking.once("helper quiet", f"{row.n}:{last_seen}"):
                speaking.agent.say("quiet", n=row.n, name=row.name, minutes=int((time.time() - last_seen) // MINUTE))
            if not stopped:
                self.name_idle(context, speaking, row)

    def name_idle(self, context: AgentContext, speaking: AgentContext, row) -> None:
        agent = Agents(Record(context.record.root, row.environment), actor=SYSTEM).primary_to_read()
        idle = agent.idle_for if agent else 0.0
        after, every, repeats = (float(context.settings.idle_after) * MINUTE, float(context.settings.idle_every) * MINUTE, int(context.settings.idle_repeats))
        if idle < after:
            return
        notice = 1 + int((idle - after) // every) if every else 1
        if (not repeats or notice <= 1 + repeats) and speaking.once("helper idle", f"{row.n}:{agent.at}:{notice}"):
            speaking.agent.say("idle", n=row.n, name=row.name, minutes=int(idle // MINUTE))
