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
        icon, description, responsible, not_responsible, skills, tools, inputs, outputs, cardinality, runs, model). Cardinality is one of
        {', '.join(CARDINALITIES)}: worktree means one running instance per ticket, plural any number, global one for the
        whole journal, whose tasks wait their turn across every ticket, plan one agent for a whole plan, kept in the plan's one
        worktree and handed each next task. runs is agent for a role that works as a full agent
        of its own, such as a developer, or subagent (the default) for a short job. journal ticket
        organization shows what is read; a lead that is not one of its domain's roles, or an unknown cardinality or runs, is refused
        with the file that says it.

        A ticket's agent hands work to a domain with journal todo delegate "<task>" <domain> [--role <role>] [--given
        "<context>"]: the task becomes a to-do in the ticket's environment, tagged with its domain and role (the domain's lead
        when no role is named), and the command returns the brief to dispatch one subagent with. A role that is worktree
        queues its tasks one after another; a plural role takes them side by side. A task must name the role's inputs, and a
        report on it must mention every one of the role's outputs. The brief points at an AGENTS.md beside role.toml or
        domain.toml as the instructions to read first, and at every skills/<skill>/SKILL.md in the role's folder (that role
        only) or the domain's (every role in it).
    """
