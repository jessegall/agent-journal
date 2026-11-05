from core.base.driver.path_mentions import PathMentions
from core.base.query.queries import Queries
from core.modules.drivers.models.helper_job import HelperJob


class HelperReuse:
    """Finds the ended job of a profile, under one parent, that worked on files a new job names."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def known_job(self, parent_id: int, profile: str, text: str) -> HelperJob | None:
        paths = PathMentions.found(text)
        if not paths:
            return None
        jobs = self.queries.query(HelperJob).filter(agent_id=parent_id, profile=profile).newest().all_rows()
        return next((job for job in jobs if job.ended_at is not None and job.helper_id is not None and PathMentions.overlap(paths, PathMentions.found(job.instruction))), None)
