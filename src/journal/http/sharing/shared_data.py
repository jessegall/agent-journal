from journal.features.sharing.share_targets import ShareTargets
from journal.features.sharing.shared_comments import SharedComments
from journal.http.plans.plan_outline import PlanOutline
from journal.http.plans.plan_timeline import PlanTimeline
from journal.models.share import Share
from journal.repositories.docs import Docs
from journal.repositories.plans import Plans
from journal.repositories.reports import Reports
from journal.support.scope import Scope


class SharedData:
    """What the share page reads of a link: the row it opens, a plan in outline with its tasks, and the comments visitors left, as the journal holds each."""

    def __init__(self, targets: ShareTargets, docs: Docs, reports: Reports, plans: Plans, outline: PlanOutline, scope: Scope, comments: SharedComments, timeline: PlanTimeline) -> None:
        self.timeline = timeline
        self.targets, self.docs, self.reports, self.plans, self.outline, self.scope, self.comments = targets, docs, reports, plans, outline, scope, comments

    def build(self, share: Share) -> dict:
        target = self.targets.targets(share)
        with self.scope.environment(share.environment_id):
            opened = self.opened(target) if target else {}
        return {"share": {"target": str(target) if target else "", "expires_at": share.expires_at, "comments": share.comments},
                **opened, "comments": self.comments.comments(share) if share.comments else []}

    def opened(self, target) -> dict:
        if target.type == "docs":
            return {"docs": [self.docs.find(target.id)]}
        if target.type == "reports":
            return {"reports": [self.reports.find(target.id)]}
        plan = self.plans.find(target.id)
        return {"plans": [self.outline.build(plan)], "tasks": self.plans.plan_tasks(plan), "timeline": self.timeline.build(plan)}
