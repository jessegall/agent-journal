from features.base import Feature
from features.journal import Journal
from features.pull_requests.details import PullRequestsDetails
from features.pull_requests.handlers import PinPullRequests


class PullRequests(Feature):
    details = PullRequestsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PinPullRequests())
