from collections.abc import Sequence

from engine.module.ask_fact import AskFact
from engine.module.ask_facts import AskFacts
from core.modules.drivers.support.helper_job_rows import HelperJobRows


class HelperAskFacts(AskFacts):
    """What any helper's question carries: the title, brief and profile of the job it works."""

    def __init__(self, jobs: HelperJobRows) -> None:
        self.jobs = jobs

    def facts(self, asker_id: int, task_id: int | None) -> Sequence[AskFact]:
        job = self.jobs.open_job(asker_id)
        if job is None:
            return ()
        return (AskFact("job", job.title or job.description), AskFact("brief", job.brief), AskFact("profile", job.profile))
