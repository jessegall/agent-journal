from journal.features.entry import Entry
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.features.skill import Skill
from journal.features.skills.commands.skill_command import SkillCommand
from journal.features.skills.listeners.forget_at_compaction import ForgetAtCompaction
from journal.features.skills.listeners.hold_writes_while_skill_owed import HoldWritesWhileSkillOwed
from journal.features.skills.listeners.keep_from_stopping_while_skill_owed import KeepFromStoppingWhileSkillOwed
from journal.features.skills.listeners.mark_loaded import MarkLoaded
from journal.features.skills.listeners.require_at_prompt import RequireAtPrompt
from journal.features.skills.listeners.require_at_start import RequireAtStart


class Skills(Feature):
    """Writes every feature's skill for the agent and makes it read the right one at the right moment."""

    name = "skills"
    title = "Skills"
    help = "The journal's skills are written for the agent and required by the workflows at the moments they matter: the journal's at a start, a state's at a start in it, the ones a prompt names; a write waits until the file is read."
    commands = (SkillCommand,)
    listeners = (RequireAtStart, RequireAtPrompt, HoldWritesWhileSkillOwed, KeepFromStoppingWhileSkillOwed, MarkLoaded, ForgetAtCompaction)
    checks = (
        Entry(NodeKind.CHECK, 'prompt_names_skill', "Prompt names a skill's keyword?", "the prompt the user sent names a keyword of one of the journal's skills"),
        Entry(NodeKind.CHECK, 'skill_owed', 'Has a skill still to read?', "the agent owes a read of a skill's file: required and not read since"),
    )
    actions = (
        Entry(NodeKind.ACTION, 'require_skill', 'Require a skill to be read', 'the agent owes a read of the skill named in the text, told where its file is; with no text, the skills the prompt names at a prompt, else the skill of the state the agent is in', takes_text=True),
    )

    REQUIRED = Nudge(name, "required", "read the {{skill}} skill before anything else: {{path}}", "writes wait until you have", repeat_after=0)
    STOPPED_OWING = Nudge(name, "stopped_owing", "you stopped while the journal awaits the {{skills}} skill to be read", "do that first, or `journal stuck \"<why>\"` if you are truly stuck", repeat_after=0)
    nudges = (REQUIRED, STOPPED_OWING)

    skill = Skill("journal", "The journal, its commands and when each applies; load it first in every session", """
# The journal

A line that starts with [journal] is the journal speaking, never the user: act on it as an instruction, and never
answer it in the chat.

The journal keeps this project's durable state beside the code and tells you what to do at the
moments you would otherwise get wrong. Every command is `journal <noun> <verb>`; `journal <noun> --help`
lists the verbs.

- **task**: what you are working on: `journal task start <n>` or `journal task create "<title>" --start`. Log where it stands with `journal task log <n> "<line>"`, finish
  with `journal task done <n> --how "<outcome>"`.
- **plan**: ordered tasks. `journal plan start <n>` follows it: finishing a task starts the next.
- **message** and **question**: what you and the user say to each other. Answer unread messages first;
  `journal question ask "<text>" --options a,b` waits for the user.
- **fact**, **rule**, **reminder**: what must survive the context window. At a context mark, writes wait
  until you record one or say `journal nothing survives "<why>"`.
- **sequence**, **worker**, **skill**: steps to follow, agents that write for you, and these files.
- **shell**: a long command moves to the background; read any output by its number with `journal output read <n>`;
  `journal reader add` keeps a reader that picks the lines worth seeing.
- `journal environment here` after a compaction or a takeover lists what is in flight.
- `journal await "<what>"` when you wait on something outside your hands, then end your turn.
- Also: **report**, **doc**, **check**, **chart**, **plugin**, **secret**, **template**, **notice**; `journal <noun> --help` lists the verbs.
- `journal stuck "<why>"` when you are truly stuck: the journal stays quiet until your next tool use.

A line from the journal is an instruction, never a message: act on it, and write nothing about it in the chat.
""")
