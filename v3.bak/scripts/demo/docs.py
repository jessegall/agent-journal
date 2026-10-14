from scripts.demo.session import Session

NAME = "cedar-lantern"
FIRST_COMMIT = "Add the welcome desk notes and approved draft"
WRITING = "Writing a document"

CHAPTERS = {
    "Before visitors arrive": "Arrive at 08:45 on Saturday, before the 09:00 opening. Use the code given in person by the coordinator to take the key from the blue lockbox. Put the sign outside, turn on the desk lamp and open a blank page in the visitor register.",
    "During the shift": "Write requests for unlisted books on a card for the coordinator. At noon, hand the register and desk key to the next volunteer, and mention any books waiting for collection.",
    "At closing": "At 16:00, bring in the sign, switch off the desk lamp and return the key to the blue lockbox.",
}


def lesson(s: Session) -> None:
    s.started()
    s.stop()
    asked = s.user("Can you write a document for our Volunteer handbook about the Cedar Lantern welcome desk? "
                   "The field notes and an approved short draft are both in the project.")
    todo = s.made("todo", "create", "Document the Cedar Lantern welcome desk", "--brief", "Use the source the user chooses and put the document in the Volunteer handbook")
    collection = s.made("collection", "create", "Volunteer handbook", "--brief", "The Cedar Lantern volunteers' opening and handover guidance")
    s.reply(asked, "I found both sources. I'll use the one you choose, then put the document in the Volunteer handbook and link it to this request.")
    source = s.ask("Which source should I use for the welcome desk document?", f"todo:{todo}",
                   {"Write from the field notes": "Build the guide chapter by chapter from the notes",
                    "File the approved draft": "File the ready text as a document with its existing chapters"}, "Write from the field notes")
    s.answered(source)
    s.journal("todo", "start", str(todo))
    s.shell("sed -n '1,12p' notes/welcome-desk.md")
    doc = s.made("doc", "create", "Cedar Lantern welcome desk guide", "--brief", "A Saturday opening, handover and closing guide for Cedar Lantern volunteers.")
    about = f"doc:{doc}"
    s.follow(WRITING, about)
    for chapter in CHAPTERS:
        s.journal("doc", "section", str(doc), chapter, "Being written.")
    s.say(f"I have laid out the guide's three chapters so you can follow along.\n\ndoc {doc}")
    s.onward(WRITING, about)
    s.follow(WRITING, about)
    for chapter, body in CHAPTERS.items():
        s.journal("doc", "section", str(doc), chapter, body)
    s.journal("work", "log", "Wrote each chapter from the field notes in opening, shift and closing order")
    s.onward(WRITING, about)
    s.follow(WRITING, about)
    s.journal("collection", "all")
    s.journal("collection", "add", str(collection), about)
    s.onward(WRITING, about)
    s.follow(WRITING, about)
    s.journal("doc", "link", str(doc), f"message:{asked}")
    s.journal("doc", "link", str(doc), f"todo:{todo}")
    s.onward(WRITING, about)
    s.follow(WRITING, about)
    s.onward(WRITING, about)
    s.follow(WRITING, about)
    s.say(f"The guide now covers opening, the noon handover and closing. It is in the Volunteer handbook.\n\ndoc {doc}")
    s.onward(WRITING, about)
    s.journal("todo", "done", str(todo), "--how", "The welcome desk document is in the Volunteer handbook and linked to the request")
    s.stop()
