from features.base import FeatureDetails
from features.organization.files import CARDINALITIES, FOLDER


class OrganizationDetails(FeatureDetails):
    name = "organization"
    when = "a ticket's work is split over domains and roles, or the organization's files change"

    title = "Agent organization"

    abstract = "The project's domains and the roles under them, read from files in the project"

    help = f"""
        The organization lives in {FOLDER}/ at the project root: domains/<domain>/domain.toml names a domain (title, icon,
        description, responsible, not_responsible, lead), and domains/<domain>/roles/<role>/role.toml a role under it (title,
        icon, description, responsible, not_responsible, skills, tools, inputs, outputs, cardinality). Cardinality is one of
        {', '.join(CARDINALITIES)}: worktree means one running instance per ticket, plural any number. journal ticket
        organization shows what is read; a lead that is not one of its domain's roles, or an unknown cardinality, is refused
        with the file that says it.
    """
