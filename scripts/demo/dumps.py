import json

from resources.base import USER
from scripts.demo.session import Session

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
    "The Okafors": "runner beans (Painted Lady) and chard.",
    "Mira and Tom": "tomato Gardener's Delight and nasturtium.",
    "Mrs Pellow": "broad beans (Aquadulce) and sweet peas.",
    "The Varga family": "squash Crown Prince, dill and coriander.",
    "Packets": "Label each packet with the variety and the year it was saved.",
}
LEFT_OUT = "The seed swap list leaves the phone numbers out"


def written(s: Session, dump: int, title: str, brief: str, sections: dict[str, str], why: str) -> int:
    s.dump_log(dump, f"Writing {title}", "--making", f"doc, {title}", "--detail", why)
    doc = s.made("doc", "create", title, "--brief", brief)
    s.dump_log(dump, f"Writing {title}", "--on", f"doc:{doc}", "--detail", why)
    for part, body in sections.items():
        s.journal("doc", "section", str(doc), part, body)
    return doc


def lesson(s: Session) -> None:
    s.started()
    s.stop()
    dump = s.made("dump", "create", "--brief", NOTE, actor=USER)
    for path in (f"downloads/{ROTA}", f"downloads/{SEEDS}"):
        s.journal("dump", "attach", str(dump), path, actor=USER)
    asked = s.user("I've dumped this autumn's allotment bits: the committee's note about the work day, a screenshot of the watering rota and the seed swap list. Can you sort them out?")
    about = f"dump:{dump}"
    s.follow(FILING, about)
    s.journal("dump", "items", str(dump))
    s.dump_log(dump, "Reading the pile", "--detail", "A pasted note, a screenshot and a text file")
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
    s.dump_log(dump, "Asking about the numbers", "--detail", "The seed swap list carries members' phone numbers")
    s.journal("dump", "ask", str(dump), "The seed swap list has each member's phone number. Should the document keep them?",
              "--guesses", "Leave them out|Keep the numbers")
    s.reply(asked, "I'm sorting it in the dump. One question waits for you there, about the seed swap list.")
    s.stop()

    s.dump_answered(dump, "Leave them out")
    s.journal("dump", "say", str(dump), "I'll leave the numbers out; the list keeps who brings which seeds.")
    swap = written(s, dump, "Seed swap list", "Who brings which seeds to the work day", SEED_LIST, LEFT_OUT)
    s.journal("doc", "link", str(swap), f"doc:{day}")
    s.journal("dump", "filed", str(dump), SEEDS, LEFT_OUT, "--refs", f"doc:{swap}")
    s.onward(FILING, about)
    s.follow(FILING, about)
    offered = json.dumps([{"ask": "Shall I remind you about the work day on the evening before?", "label": "Remind me"}])
    s.journal("dump", "offer", str(dump), offered, "--summary",
              f"Three documents in {COLLECTION}: the October work day, the autumn watering rota with its screenshot, and the "
              f"seed swap list. The work day's three jobs are to-dos. {LEFT_OUT}.")
    s.onward(FILING, about)
    s.say(f"Your dump is sorted into {COLLECTION}: three documents, and the work day's jobs as to-dos. {LEFT_OUT}.")
    s.stop()
