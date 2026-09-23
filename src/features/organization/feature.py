from features.base import Feature
from features.journal import Journal
from features.organization.commands import ShowOrganization
from features.organization.details import OrganizationDetails


class OrganizationFeature(Feature):
    details = OrganizationDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("ticket", ShowOrganization())
