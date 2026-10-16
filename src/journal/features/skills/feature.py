from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.skill import Skill
from journal.features.skills.commands.skill_command import SkillCommand
from journal.features.skills.listeners.forget_at_compaction import ForgetAtCompaction
from journal.features.skills.listeners.mark_loaded import MarkLoaded
from journal.features.skills.states.loading_skill import LoadingSkill


class Skills(Feature):
    """Writes every feature's skill for the agent and makes it read the right one at the right moment."""

    name = "skills"
    title = "Skills"
    help = "The journal's skills are written for the agent and required by the workflows at the moments they matter: the journal's at a start, a state's at a start in it, the ones a prompt names; a write waits until the file is read."
    states = (LoadingSkill,)
    commands = (SkillCommand,)
    listeners = (MarkLoaded, ForgetAtCompaction)

    REQUIRED = Nudge(name, "required", "read the {{skill}} skill before anything else: {{path}}", "writes wait until you have", repeat_after=0)
    nudges = (REQUIRED,)

    skill = Skill("journal", "The journal, its commands and when each applies; load it first in every session", """
# The journal

The journal keeps this project's durable state beside the code and tells you what to do at the
moments you would otherwise get wrong. Every command is `journal <noun> <verb>`; `journal <noun> --help`
lists the verbs.

- **task**: what you are working on. A file write with no task started is refused; `journal task start <n>`
  or `journal task create "<title>" --start`. Log where it stands with `journal task log <n> "<line>"`, finish
  with `journal task done <n> --how "<outcome>"`.
- **plan**: ordered tasks. `journal plan start <n>` follows it: finishing a task starts the next.
- **message** and **question**: what you and the user say to each other. Answer unread messages first;
  `journal question ask "<text>" --options a,b` waits for the user.
- **fact**, **rule**, **reminder**: what must survive the context window. At a context mark, writes wait
  until you record one or say `journal nothing survives "<why>"`.
- **sequence**, **worker**, **skill**: steps to follow, agents that write for you, and these files.
- `journal stuck "<why>"` when you are truly stuck: the journal stays quiet until your next tool use.

A line from the journal is an instruction, never a message: act on it, and write nothing about it in the chat.
""")
