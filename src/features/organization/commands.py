from features.organization.files import organization
from features.parts import Command, Context


class ShowOrganization(Command):
    name = "organization"

    def run(self, context: Context, tickets):
        return organization(context.record.root.parent).shaped()
