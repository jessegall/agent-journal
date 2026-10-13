from events import Fact
from events.agents import AgentChanged, ClockTicked, ToolCallAnswered
from events.helpers import (AnswerToRelay, HelperAsks, HelperIdle, HelperQuiet, HelperRefused, HelperStopped, HelperTurnFailed, SubagentAsks,
                            SubagentTouched)
from events.messages import MessageCreated
from events.questions import QuestionCreated
from controllers.stored import IDEMPOTENCY
from declaring.trigger import MINUTE
from features.helpers.asking import listed_options, subagent_name
from receiving import Listener
from resources.base import AGENT
from resources.types import FAILED, AgentRow, Helper, Message, Question
from serving import Clock, ReadElsewhere, ReadRows, Settings


class SpotFailedTurn(Listener[AgentChanged]):
    def listen(self, event: AgentChanged, agents: ReadRows[AgentRow], helpers: ReadRows[Helper]) -> list[Fact]:
        row = agents.peek(event.agent)
        if event.action != "updated" or row.event != FAILED or helpers.helping() is None:
            return []
        return [HelperTurnFailed(failure=row.failure)]


class SpotWatchedHelpers(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, helpers: ReadRows[Helper], agents: ReadRows[AgentRow], settings: Settings, clock: Clock) -> list[Fact]:
        primary = agents.primary_to_read()
        if not settings.is_on("watch") or primary is None or primary.n != event.agent:
            return []
        now, found = clock.now(), []
        for row in helpers.rows.standing():
            if row.report or row.stopped_by_user:
                continue
            seen = helpers.watch(row)
            if seen.refusal is not None:
                found.append(HelperRefused(n=row.n, name=row.name, provider=row.provider, reason=seen.refusal, ref=row.ref).once(f"helper refused|{row.n}:{seen.refusal}"))
                continue
            if not seen.seated:
                continue
            if not seen.runs:
                found.append(HelperStopped(n=row.n, name=row.name, cause=helpers.launch_cause(row), ref=row.ref).once(f"helper stopped|{row.n}:{seen.heard}"))
                continue
            if now - seen.heard >= float(settings.quiet_after) * MINUTE and not seen.own_work:
                found.append(HelperQuiet(n=row.n, name=row.name, minutes=int((now - seen.heard) // MINUTE)).once(f"helper quiet|{row.n}:{seen.heard}"))
            idle = idle_notice(seen, settings)
            if idle:
                found.append(HelperIdle(n=row.n, name=row.name, minutes=int(seen.idle_for // MINUTE)).once(f"helper idle|{row.n}:{seen.agent_at}:{idle}"))
        return found


def idle_notice(seen, settings: Settings) -> int:
    """Which idle notice this is, counting from one, or none when the agent is not idle long enough, works on its own, or has been told as often as allowed."""
    after, every, repeats = float(settings.idle_after) * MINUTE, float(settings.idle_every) * MINUTE, int(settings.idle_repeats)
    if not seen.agent_present or seen.own_work or seen.idle_for < after:
        return 0
    notice = 1 + int((seen.idle_for - after) // every) if every else 1
    return notice if not repeats or notice <= 1 + repeats else 0


class SpotAnswerToDispatcher(Listener[MessageCreated]):
    """While a helper works a follow-up, a message it writes in its own environment reaches the dispatcher's chat as a message from the helper, as its report does."""

    def listen(self, event: MessageCreated, helpers: ReadRows[Helper], messages: ReadRows[Message]) -> list[Fact]:
        helper = helpers.helper_here()
        if helper is None or event.actor != AGENT or not helper.answering:
            return []
        written = messages.peek(event.n)
        if written.data.get("from_main") or written.data.get("peer") or written.data.get(IDEMPOTENCY):
            return []
        return [AnswerToRelay(message=event.n)]


class SpotQuestionAskedAway(Listener[QuestionCreated]):
    def listen(self, event: QuestionCreated, questions: ReadRows[Question], helpers: ReadRows[Helper], agents: ReadRows[AgentRow], elsewhere: ReadElsewhere) -> list[Fact]:
        question = questions.peek(event.n)
        place = helpers.helping()
        if question.hidden or not (place or question.agent):
            return []
        if not place:
            return [SubagentAsks(who=f"subagent {subagent_name(agents.primary_to_read(), question.agent)}", question=question.n, text=question.title,
                                 options=listed_options(question), command=f'journal question answer {question.n} "<answer>" --set reason="<why>"', ref=question.ref)]
        helper = helpers.helper_for(place)
        if not elsewhere.named(place.launched_from).rows(AgentRow).has_primary():
            return []
        return [HelperAsks(environment=place.launched_from, who=f"helper {helper.n}, {helper.name}", question=question.n, text=question.title, options=listed_options(question),
                           command=f'journal --env "{place.title}" question answer {question.n} "<answer>" --set reason="<why>"', ref=helper.ref)]


class SpotSubagentFiles(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, agents: ReadRows[AgentRow], helpers: ReadRows[Helper]) -> list[Fact]:
        if not event.subagent:
            return []
        row = agents.peek(event.agent)
        new = [path for path in helpers.relative_paths(event.paths) if path not in row.touched_files]
        return [SubagentTouched(agent=event.agent, files=tuple(new))] if new else []
