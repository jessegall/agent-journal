from journal.models.report import Report
from journal.repositories.scoped_repository import ScopedRepository


class Reports(ScopedRepository[Report]):
    model = Report
