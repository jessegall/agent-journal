import json

from resources.base import USER
from scripts.demo.session import DumpFork, Session

NAME = "juniper-lane"
FIRST_COMMIT = "Start the Juniper Lane allotment notes"
FILING = "Filing a dump"
NOTE = "Work day is Saturday 12 October, 10:00 till 13:00. Bring gloves and a flask; the committee brings the tea urn. Jobs: clear the compost bays, mend the gate by plot 9, and cover the empty beds for winter."
ROTA = "watering-rota.png"
SEEDS = "seed-swap.txt"
COLLECTION = "Juniper Lane allotment, autumn"

WORK_DAY = {
    "When": "Saturday 12 October, 10:00 till 13:00.",
    "What to bring": "Gloves and a flask. The committee brings the tea urn.",
    "Jobs": "Clear the compost bays, mend the gate by plot 9, and cover the empty beds for winter.",
}
JOBS = ("Clear the compost bays", "Mend the gate by plot 9", "Cover the empty beds for winter")
WATERING = {
    "How it works": "Water in the evening after 6pm. Swap with a neighbour if you cannot make your week.",
    "Weeks": "7 October: the Okafors, plots 1 to 6. 14 October: Mira and Tom, plots 7 to 12. 21 October: Mrs Pellow, plots 13 to 18. 28 October: the Varga family, every plot and the polytunnel.",
}
SEED_LIST = {
    "The Okafors": ("runner beans (Painted Lady) and chard", "07700 900142"),
    "Mira and Tom": ("tomato Gardener's Delight and nasturtium", "07700 900318"),
    "Mrs Pellow": ("broad beans (Aquadulce) and sweet peas", "07700 900527"),
    "The Varga family": ("squash Crown Prince, dill and coriander", "07700 900864"),
}
KEEP, LEAVE = "Keep the numbers", "Leave them out"


def written(s: Session, dump: int, title: str, brief: str, sections: dict[str, str], why: str) -> int:
    s.journal("dump", "log", str(dump), f"Writing {title}", "--making", f"doc, {title}", "--detail", why)
    doc = s.made("doc", "create", title, "--brief", brief)
    s.journal("dump", "log", str(dump), f"Writing {title}", "--on", f"doc:{doc}", "--detail", why)
    for part, body in sections.items():
        s.journal("doc", "section", str(doc), part, body)
    return doc


def trunk(s: Session) -> DumpFork:
    s.started()
    s.stop()
    dump = s.made("dump", "create", "--brief", NOTE, actor=USER)
    for path in (f"downloads/{ROTA}", f"downloads/{SEEDS}"):
        s.journal("dump", "attach", str(dump), path, actor=USER)
    asked = s.user("I've dumped this autumn's allotment bits: the committee's note about the work day, a screenshot of the watering rota and the seed swap list. Can you sort them out?")
    about = f"dump:{dump}"
    s.follow(FILING, about)
    s.journal("dump", "items", str(dump))
    s.journal("dump", "log", str(dump), "Reading the pile", "--detail", "A pasted note, a screenshot and a text file")
    s.journal("dump", "note", str(dump), "text", "The committee's plan for the work day on Saturday 12 October, with three jobs")
    s.journal("dump", "note", str(dump), ROTA, "A screenshot of the autumn watering rota, four households by week")
    s.shell(f"sed -n '1,12p' downloads/{SEEDS}")
    s.journal("dump", "note", str(dump), SEEDS, "The seed swap list, with each member's phone number")
    s.journal("dump", "name", str(dump), COLLECTION)
    s.onward(FILING, about)

    s.follow(FILING, about)
    day = written(s, dump, "October work day", "When the work day is, what to bring and the jobs to do", WORK_DAY,
                  "The committee's note is one subject")
    jobs = ", ".join(f"todo:{s.made('todo', 'create', job, '--brief', 'A job for the work day on Saturday 12 October')}" for job in JOBS)
    s.journal("dump", "filed", str(dump), "text", "Wrote the work day plan as a document and its three jobs as to-dos",
              "--refs", f"doc:{day}, {jobs}", "--added", jobs)
    rota = written(s, dump, "Autumn watering rota", "Who waters which plots each week this autumn", WATERING,
                   "Typed out from the screenshot so it can be searched")
    s.journal("doc", "attach", str(rota), f"downloads/{ROTA}", "--description", "The screenshot the rota was read from")
    s.journal("dump", "filed", str(dump), ROTA, "Typed the rota out as a document, with the screenshot attached", "--refs", f"doc:{rota}")
    s.journal("dump", "log", str(dump), "Asking about the numbers", "--detail", "The seed swap list carries members' phone numbers")
    s.journal("dump", "ask", str(dump), "The seed swap list has each member's phone number. Should the document keep them?",
              "--guesses", f"{KEEP}|{LEAVE}")
    s.reply(asked, "I'm sorting it in the dump. One question waits for you there, about the seed swap list.")
    s.stop()
    return DumpFork(dump, {"day": day})


def swap_list(s: Session, fork: DumpFork, listed: dict[str, str], reply: str, how: str) -> None:
    dump = fork.question
    about = f"dump:{dump}"
    s.journal("dump", "say", str(dump), reply)
    swap = written(s, dump, "Seed swap list", "Who brings which seeds to the work day",
                   {**listed, "Packets": "Label each packet with the variety and the year it was saved."}, how)
    s.journal("doc", "link", str(swap), f"doc:{fork.rows['day']}")
    s.journal("dump", "filed", str(dump), SEEDS, how, "--refs", f"doc:{swap}")
    s.onward(FILING, about)
    s.follow(FILING, about)
    offered = json.dumps([{"ask": "Shall I remind you about the work day on the evening before?", "label": "Remind me"}])
    s.journal("dump", "offer", str(dump), offered, "--summary",
              f"Three documents in {COLLECTION}: the October work day, the autumn watering rota with its screenshot, and the "
              f"seed swap list. The work day's three jobs are to-dos. {how}.")
    s.onward(FILING, about)
    s.say(f"Your dump is sorted into {COLLECTION}: three documents, and the work day's jobs as to-dos. {how}.")
    s.stop()


def keep(s: Session, fork: DumpFork) -> None:
    listed = {who: f"{brings}. Phone {phone}." for who, (brings, phone) in SEED_LIST.items()}
    swap_list(s, fork, listed, "I'll keep the numbers so members can arrange swaps with each other.", "The seed swap list keeps each member's number")


def leave(s: Session, fork: DumpFork) -> None:
    listed = {who: f"{brings}." for who, (brings, _) in SEED_LIST.items()}
    swap_list(s, fork, listed, "I'll leave the numbers out; the list keeps who brings which seeds.", "The seed swap list leaves the phone numbers out")


BRANCHES = {KEEP: keep, LEAVE: leave}
