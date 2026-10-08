from features.base import FeatureDetails
from features.groups import Group


class SecretsDetails(FeatureDetails):
    explains = "Keys and logins the agent may use without ever seeing them. You fill in their values under Settings, Secrets."
    name = "secrets"
    group = Group.PROJECT
    label = "Let the agent use keys and logins without seeing them"
    has_skill = True

    title = "Secrets"

    abstract = """
        A secret names a key or a login, says what it is for and how to use it, and lists the
        commands it may be given to. Its values live in a file in your home folder, outside the
        project, and never in the journal.
    """

    help = """
        When a task needs a key or a login you do not have, ask for it with journal secret request
        "<name>" "<why>" [--kind "api key"|login|custom]: it waits under Settings, Secrets until the
        user fills it in. Never ask the user to paste a value into the chat, and never read the
        file that holds the values. journal secret all lists the secrets with their descriptions,
        instructions and fields; journal secret read <n> shows one. A value you made yourself,
        such as a generated password, is written to a file and moved into the secret with
        journal secret store <n> <field> <file>, which deletes the file.

        The values live in one file per project under your home folder, owner-only, never in git,
        the attic, a worktree or a backup of the record; journal secret where prints its path.
        A deleted secret keeps its values for 30 days, then they are removed from the file.
    """
