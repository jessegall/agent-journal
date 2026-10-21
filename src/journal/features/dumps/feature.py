from journal.engine.nudge import Nudge
from journal.features.dumps.commands.dump_command import DumpCommand
from journal.features.dumps.states.sorting_dump import SortingDump
from journal.features.dumps.listeners.follow_dump import FollowDump
from journal.features.dumps.listeners.start_sorting_dump import StartSortingDump
from journal.features.dumps.listeners.tell_answer import TellAnswer
from journal.features.dumps.listeners.tell_arrival import TellArrival
from journal.features.dumps.listeners.tell_choice import TellChoice
from journal.features.dumps.listeners.tell_filed import TellFiled
from journal.features.feature import Feature
from journal.features.dumps.support.dumps_snapshot_reader import DumpsSnapshotReader
from journal.support.skill import Skill


class DumpsFeature(Feature):
    name = "dumps"
    title = "Dumps"
    help = "The agent sorts files you drop together by subject and files each as a row of its own."
    commands = (DumpCommand,)
    states = (SortingDump,)
    listeners = (StartSortingDump, FollowDump, TellArrival, TellAnswer, TellChoice, TellFiled)
    snapshot = (DumpsSnapshotReader,)

    DUMP_ARRIVED_FILE_IT = Nudge(name, "dump_arrived_file_it", "dump {{n}} has {{count}} to file - journal dump items {{n}}", "load journal-dumps if it is not loaded, then file it step by step. Tell the user what you do with journal dump log; ask only in the dump window, never in the chat.", repeat_after=300)
    DUMP_STILL_OPEN_CARRY_ON = Nudge(name, "dump_still_open_carry_on", "dump {{n}} is not filed yet: carry on filing it", "journal dump items {{n}} shows what is left; ask only what you cannot tell, with journal dump ask. The dump is done once every item is filed or failed.", repeat_after=0)
    THE_USER_ANSWERED_ON_THE_DUMP = Nudge(name, "the_user_answered_on_the_dump", "the user answered your question on dump {{n}} - {{answer}}", "carry on filing with that answer. The question was: {{question}}", repeat_after=0)
    DUMP_FILED_SUM_IT_UP = Nudge(name, "dump_filed_sum_it_up", "dump {{n}} is filed ({{outcome}}) - sum it up for the user", """sum up what you filed and where in two or three lines, with any next step worth taking as a button on the dump: journal dump offer {{n}} '[{"ask": "Want me to plan the mobile layout?", "label": "Plan it"}]' --summary "<what you filed and where>", or '[]' for none. Start nothing yourself.""", repeat_after=0)
    THE_USER_CHOSE_A_STEP = Nudge(name, "the_user_chose_a_step", "the user chose {{label}} for dump {{n}}", "carry that step out, and log it on the dump.", repeat_after=0)
    DUMP_LEFT_TO_YOU_FINISH_IT = Nudge(name, "dump_left_to_you_finish_it", "the user left dump {{n}} to you - finish it", "take the next step you think best and file anything still open yourself, logging each step on the dump. Nothing waits for the user.", repeat_after=0)
    nudges = (DUMP_ARRIVED_FILE_IT, DUMP_STILL_OPEN_CARRY_ON, THE_USER_ANSWERED_ON_THE_DUMP, DUMP_FILED_SUM_IT_UP, THE_USER_CHOSE_A_STEP, DUMP_LEFT_TO_YOU_FINISH_IT)

    skill = Skill("dumps", "File what the user dropped in a dump: sort the pile by subject into rows of their own; load it when a dump arrives", """
# Dumps

A dump holds pasted text and dropped files; each is an item. Sort the pile by subject: one document per subject,
named for what it is about, never after the file it came in. One dump is worked at a time; the next waits until it closes.

1. `journal dump items <n>` lists where every item stands.
2. Read each item, then `journal dump note <n> <item> "<what it is>"`.
3. Write what it becomes (a doc, a plan, a task), then
   `journal dump filed <n> <item> "<what it did>" --refs "doc:2, plans:1" --added "doc:3"` (`--added` names rows you wrote
   unasked, also listed in refs), or `journal dump failed <n> <item> "<why>"`. What you file is in the journal at once.
4. `journal dump name <n> "<name>"` names the dump for what its items are about; `journal dump log <n> "<status>"`
   (at most 40 characters, `--detail` for the sentence) tells the user what you are doing.
5. `journal dump split <n> "<part>, <part>"` splits pasted text into parts, one item each.
6. `journal dump ask <n> "<question>" --guesses "a|b"` asks the user in the dump window; they answer there.
   What the user writes in the dump reaches you as a message about it: answer with `journal dump say <n> "<text>"`
   (at most 600 characters), never in the chat; the chat shows a small mark that you answered in the dump.
7. The dump closes by itself once every item is filed or failed. Then sum it up with
   `journal dump offer <n> '[{"ask": "Want me to plan the mobile layout?", "label": "Plan it"}]' --summary "<what you filed and where>"`
   (`'[]'` for no next step) and start nothing yourself.
8. Only the user stops, removes, or chooses a next step. `journal dump reopen <n>` works a closed dump again.
""", keywords=("dump", "dumps", "dumped"))
