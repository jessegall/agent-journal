from journal.models.writing import Doc, Report
from journal.repositories.base import ScopedRepository


class Reports(ScopedRepository[Report]):
    model = Report


class Docs(ScopedRepository[Doc]):
    model = Doc
