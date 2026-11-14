from types import SimpleNamespace

from engine.module.ask_fact import AskFact
from core.modules.asks.support.helper_ask_facts import HelperAskFacts


class OpenJobs:
    def __init__(self, job):
        self.job = job

    def open_job(self, helper_id):
        return self.job


def test_job_title_brief_profile():
    job = SimpleNamespace(title="Read the merge queue", description="", brief="Find where merges wait", profile="journal-researcher")
    assert tuple(HelperAskFacts(OpenJobs(job)).facts(7, None)) == (AskFact("job", "Read the merge queue"), AskFact("brief", "Find where merges wait"), AskFact("profile", "journal-researcher"))


def test_a_helper_with_no_open_job_carries_no_facts():
    assert tuple(HelperAskFacts(OpenJobs(None)).facts(7, None)) == ()
