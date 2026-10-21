from journal.features.feature import Feature
from journal.features.skills.listeners.skill_obligation import SkillObligation
from journal.features.skills.skills_conduct import SkillsConduct
from journal.features.skills.support.skills_data_reader import SkillsDataReader
from journal.features.skills.support.skills_data import SkillsData
from journal.engine.nudge import Nudge
from journal.support.skill import Skill
from journal.features.skills.commands.skill_command import SkillCommand
from journal.features.skills.listeners.compaction_reset import CompactionReset
from journal.features.skills.listeners.skill_card import SkillCard


class Skills(Feature[SkillsData]):
    """Writes every feature's skill for the agent and makes it read the right one at the right moment."""

    name = "skills"
    title = "Skills"
    help = "The journal's skills are written for the agent and required by the states at the moments they matter: the journal's at a start, a state's at a start in it, the ones a prompt names; a write waits until the file is read."
    commands = (SkillCommand,)
    listeners = (SkillObligation, SkillCard, CompactionReset)
    data = (SkillsDataReader,)
    conduct = (SkillsConduct,)

    SKILL_READ_REQUEST = Nudge(name, "read_the_skill_first", "read the {{skill}} skill before anything else: {{path}}", "writes wait until you have", repeat_interval=0)
    UNREAD_SKILL_STOP = Nudge(name, "stopped_owing", "you stopped while the journal awaits the {{skills}} skill to be read", "do that first, or `journal stuck \"<why>\"` if you are truly stuck", repeat_interval=0)
    nudges = (SKILL_READ_REQUEST, UNREAD_SKILL_STOP)

    skill = Skill("journal", "The journal, its commands and when each applies; load it first in every session", """
# The journal

A line that starts with [journal] is the journal speaking, never the user: act on it as an instruction, and never
answer it in the chat.

The journal keeps this project's durable state beside the code and tells you what to do at the
moments you would otherwise get wrong. Every command is `journal <noun> <verb>`; `journal <noun> --help`
lists the verbs.

- **task**: what you are working on: `journal task start <n>` or `journal task create "<title>" --start`. Log where it stands with `journal task log <n> "<line>"`, finish
  with `journal task complete <n> --how "<outcome>"`.
- **plan**: ordered tasks. `journal plan start <n>` follows it: finishing a task starts the next.
- **message** and **question**: what you and the user say to each other. Answer unread messages first;
  `journal question ask "<text>" --options "a" "b"` waits for the user.
- **fact**, **rule**, **reminder**: what must survive the context window. At a context mark, writes wait
  until you record one or say `journal memory skip "<why>"`.
- **sequence**, **worker**, **skill**: steps to follow, agents that write for you, and these files.
- **shell**: a long command moves to the background; read any output by its number with `journal output read <n> --tail 20` (or --grep, --summary, --all);
  `journal reader add` keeps a reader that picks the lines worth seeing.
- **alias**: `journal alias add <name> "<line>" --reader <reader>` names a command line; `journal <name> [args]` runs it
  with the args at its end and watches a long run through its reader. Plugins ship aliases too; `journal alias list` names them.
- `journal environment overview` after a compaction or a takeover lists what is in flight, then runs the journal commands
  the setting briefing.look_commands names, each under its heading: by default the started plan with its phase in hand,
  the task list, the unread messages, the workers, the open questions and the task in hand read whole.
- `journal await "<what>" --output <n>` or `--until "<script>"` when you wait on something outside your hands, then end
  your turn: the wait ends by itself once that is done.
- `journal search "<words>"` finds every task, plan, message, document, report and agent conversation here that holds
  all the words: look there before saying you do not know or asking the user again.
- Also: **report**, **doc**, **check**, **plugin**, **secret**, **template**, **notice**; `journal <noun> --help` lists the verbs.
- `journal stuck "<why>"` when you are truly stuck: the journal stays quiet until your next tool use.

A line from the journal is an instruction, never a message: act on it, and write nothing about it in the chat.
""")
