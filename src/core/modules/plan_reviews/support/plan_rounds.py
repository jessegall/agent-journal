from collections.abc import Iterator, Mapping, Sequence, Set
import re

from engine.change.event_log import EventLog
from engine.change.logged_event import LoggedEvent
from engine.model.model import Model
from engine.model.tables import Tables
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.report import Report
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.plan_reviews.support.plan_round import PlanRound
from core.modules.plan_reviews.support.review_state import REVIEW_MOVE, REVIEWED_MOVE
from core.modules.plan_reviews.support.round_report import RoundReport
from core.modules.plan_reviews.support.round_reviewer import RoundReviewer
from core.modules.plans.models.plan import Plan

REVIEW_EVENT = f"{Plan.model_name}.{REVIEW_MOVE.name}"
REVIEWED_EVENT = f"{Plan.model_name}.{REVIEWED_MOVE.name}"


class PlanRounds:
    """The review rounds of a plan, oldest first, worked out from its log: each round starts at a review move
    and ends at the next reviewed move, and one with no end is still running. A round holds the reports linked
    to the plan and the helpers started about the plan while it ran."""

    def __init__(self, queries: Queries, log: EventLog, tables: Tables) -> None:
        self.queries, self.log, self.tables = queries, log, tables

    def rounds(self, plan: Plan) -> tuple[PlanRound, ...]:
        events = sorted(self.log.row_events(self.tables.table(Plan).name, plan.id), key=lambda event: event.id)
        pairs = tuple(self.pairs(events))
        if not pairs:
            return ()
        links = list(self.queries.query(Link).filter(link_type=LinkType.SUBJECT, source_model=Report.model_name, target_model=Plan.model_name, target_id=plan.id).all_rows())
        link_events = self.creation_events(Link, [link.id for link in links])
        filed = self.queries.query(Report).find_many([link.source_id for link in links])
        pattern = re.compile(rf"\bplan[ :]{plan.id}\b")
        jobs = [job for job in self.queries.query(HelperJob).filter(environment_id=plan.environment_id).matching(Minimum("created_at", pairs[0][0].timestamp.text)).all_rows() if pattern.search(job.brief)]
        job_events = self.creation_events(HelperJob, [job.id for job in jobs])
        helper_ids = [job.helper_id for job in jobs if job.helper_id is not None]
        names = self.actor_names({*helper_ids, *(report.creator_id for report in filed)})
        reports = {report.id: RoundReport(report.id, names[report.creator_id], report.creator_id) for report in filed}
        return tuple(PlanRound(number, start.timestamp, end.timestamp if end is not None else None, start.actor_id,
                               tuple(dict.fromkeys(RoundReviewer(job.helper_id, names[job.helper_id]) for job in jobs if job.helper_id is not None and self.contains_event(job_events[job.id], start, end))),
                               tuple(reports[link.source_id] for link in links if link.source_id in reports and self.contains_event(link_events[link.id], start, end)))
                     for number, (start, end) in enumerate(pairs, 1))

    @staticmethod
    def pairs(events: Sequence[LoggedEvent]) -> Iterator[tuple[LoggedEvent, LoggedEvent | None]]:
        start = None
        for event in events:
            if event.event == REVIEW_EVENT:
                if start is not None:
                    yield start, None
                start = event
            elif event.event == REVIEWED_EVENT and start is not None:
                yield start, event
                start = None
        if start is not None:
            yield start, None

    def creation_events(self, model: type[Model], row_ids: Sequence[int]) -> Mapping[int, int]:
        created: dict[int, int] = {}
        for event in sorted(self.log.row_events_many(self.tables.table(model).name, row_ids), key=lambda event: event.id):
            created.setdefault(event.row_id, event.id)
        return created

    @staticmethod
    def contains_event(event_id: int, start: LoggedEvent, end: LoggedEvent | None) -> bool:
        return start.id < event_id and (end is None or event_id < end.id)

    def actor_names(self, actor_ids: Set[int]) -> Mapping[int, str]:
        actors = {actor.id: actor.name for actor in self.queries.query(ActorRecord).find_many(sorted(actor_ids))}
        agents = {agent.id: agent.given_name or agent.profile or agent.role for agent in self.queries.query(Agent).find_many(sorted(actor_ids))}
        return {**actors, **agents}
