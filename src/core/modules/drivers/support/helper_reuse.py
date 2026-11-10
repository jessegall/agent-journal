from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.driver.path_mentions import PathMentions
from engine.query.queries import Queries
from core.modules.drivers.models.helper_job import HelperJob


class HelperReuse:
    """Finds the ended job of a profile, under one parent, that worked on files a new job names."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def known_job(self, parent_id: int, profile: str, text: str) -> HelperJob | None:
        paths = PathMentions.found(text)
        if not paths:
            return None
        jobs = tuple(self.queries.query(HelperJob).filter(profile=profile).newest().all_rows())
        main_ids = MainAgentFinder.main_ids(self.queries, tuple({job.session_agent_id for job in jobs} | {parent_id}))
        parents = main_ids if parent_id in main_ids else {parent_id}
        jobs = [job for job in jobs if job.session_agent_id in parents]
        return next((job for job in jobs if job.ended_at is not None and job.helper_id is not None and PathMentions.overlap(paths, PathMentions.found(job.instruction))), None)
