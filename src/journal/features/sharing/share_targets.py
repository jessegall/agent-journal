from journal.models.link import Link
from journal.models.ref import Ref
from journal.models.share import Share
from journal.refused import Refused
from journal.repositories.docs import Docs
from journal.repositories.links import Links
from journal.repositories.plans import Plans
from journal.repositories.reports import Reports

SHARES = "shares"


class ShareTargets:
    """What a link opens, a document, a report or a plan, named as docs:12 and kept as a link from the share to its row."""

    def __init__(self, docs: Docs, reports: Reports, plans: Plans, links: Links) -> None:
        self.plans, self.links = plans, links
        self.repositories = {"docs": docs, "reports": reports, "plans": plans}

    def named(self, named: str) -> Ref:
        """The row a name points at, which must be there; anything else cannot be shared."""
        kind, _, number = named.strip().partition(":")
        if kind not in self.repositories or not number.isdigit():
            raise Refused(f"only a document, a report or a plan can be shared: name it as docs:12, reports:4 or plans:2, not {named!r}")
        ref = Ref(kind, int(number))
        self.repositories[ref.type].find(ref.id)
        return ref

    def link(self, share: Share, target: Ref, by) -> None:
        self.links.save(Link(source=Ref.to(share), target=target, kind=SHARES), by)

    def of(self, share: Share) -> Ref | None:
        """The row the share opens; none when it was deleted with its links."""
        targets = self.links.targets(share, SHARES)
        return targets[0] if targets else None

    def shown(self, share: Share) -> list[Ref]:
        """The rows the link's page shows: the row, and for a plan its tasks."""
        target = self.of(share)
        if target is None:
            return []
        tasks = self.plans.tasks_of(self.plans.find(target.id)) if target.type == "plans" else []
        return [target, *(Ref.to(task) for task in tasks)]

    def opens(self, named: str) -> list[str]:
        """What a link to the row opens, one line each, as the share dialog lists it: the row, and for a plan its tasks."""
        ref = self.named(named)
        row = self.repositories[ref.type].find(ref.id)
        lines = [f"{row.title} ({ref})"]
        if ref.type == "plans":
            lines += [f"{task.title} ({Ref.to(task)})" for task in self.plans.tasks_of(row)]
        return lines
