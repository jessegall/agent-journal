from features.base import Feature
from features.helper_worktrees.controller import Worktrees
from features.helper_worktrees.details import HelperWorktreesDetails
from features.helper_worktrees.handlers import ClearTakenWorktrees
from features.helper_worktrees.interceptors import StayInYourCheckout, TellDrift
from features.journal import Journal

__all__ = ["Worktrees"]


class HelperWorktrees(Feature):
    details = HelperWorktreesDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(TellDrift())
        journal.agent.interceptor(StayInYourCheckout())
        journal.events.handler(ClearTakenWorktrees())
