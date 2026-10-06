from features.base import Feature
from features.git_actions.details import GitActionsDetails
from features.git_actions.handlers import MarkBranchSwitches, MarkGitActions
from features.journal import Journal


class GitActions(Feature):
    details = GitActionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(MarkBranchSwitches())
        journal.events.handler(MarkGitActions())
