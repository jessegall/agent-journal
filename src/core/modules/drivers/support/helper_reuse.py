from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.driver.path_mentions import PathMentions
from engine.enums.agent_role import AgentRole
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.drivers.models.helper_job import HelperJob

NEWEST_JOBS = 50


class HelperReuse:
    """Finds the ended job of a profile, under one parent, that worked on files a new job names, among the newest
    50 ended jobs of that parent."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def known_job(self, parent_id: int, profile: str, text: str) -> HelperJob | None:
        paths = PathMentions.found(text)
        if not paths:
            return None
        jobs = self.queries.query(HelperJob).where(profile=profile).where_in("session_agent_id", self.parents(parent_id))
        jobs = jobs.where_not_null("ended_at").where_not_null("helper_id").newest().take(NEWEST_JOBS)
        return next((job for job in jobs if PathMentions.overlap(paths, PathMentions.found(job.instruction))), None)

    # Every main agent shares the jobs of the others; any other parent has only its own.
    def parents(self, parent_id: int) -> Query[Agent]:
        agents = self.queries.query(Agent).select_columns("id")
        return agents.where(role=AgentRole.MAIN) if MainAgentFinder.is_main(self.queries, parent_id) else agents.where(id=parent_id)
