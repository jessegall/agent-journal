from features.base import Feature
from features.journal import Journal
from features.organization.commands import Delegate, ReportCoversOutputs, ShowOrganization
from features.organization.details import OrganizationDetails
from features.organization.handlers import StartNextForGlobalRole


class OrganizationFeature(Feature):
    details = OrganizationDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("ticket", ShowOrganization())
        journal.commands.add("todo", Delegate())
        journal.commands.intercept("update", ReportCoversOutputs())
        journal.events.handler(StartNextForGlobalRole())
