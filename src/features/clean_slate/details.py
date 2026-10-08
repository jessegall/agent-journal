from features.base import FeatureDetails
from features.groups import Group


class CleanSlateDetails(FeatureDetails):
    explains = "The journal can stop other tools from running their own commands whenever the agent does something, so they don't interrupt its turn. You choose whether this is on."
    name = "clean_slate"
    group = Group.PROJECT
    label = "Pause other tools' automatic commands while the agent runs"
    hint = "They are turned back on when the agent exits. Skills are not touched."
    has_skill = False

    title = "Other tools' hooks"


    abstract = """
        Turns off every hook that is not the journal's while the agent runs. They are turned back on
        when the agent exits or the journal stops. Skills are not touched.
    """

    help = """
        journal claude and journal codex ask, after the environment, whether to set aside the
        other hooks. Yes keeps a copy of each hook file before taking out the hooks that are not
        the journal's; the copies are kept under .journal/runtime/set-aside. Skills stay where
        they are.

        They are put back when the agent exits, when journal stop runs, and at the next launch
        if the last one ended without putting them back. Enter repeats the last answer. When
        another running session already set them aside, the question still comes, and No puts
        them back. Claude's hooks live in its settings files, Codex's in ~/.codex/hooks.json
        and the project's .codex/hooks.json.
    """
