from scripts.demo.session import Fork, Session

NAME = "cedar-lantern"
FIRST_COMMIT = "Add the welcome desk notes and approved draft"
WRITING = "Writing a document"
FILING = "Filing a written document"

CHAPTERS = {
    "Before visitors arrive": "Arrive at 08:45 on Saturday, before the 09:00 opening. Use the code given in person by the coordinator to take the key from the blue lockbox. Put the sign outside, turn on the desk lamp and open a blank page in the visitor register.",
    "During the shift": "Write requests for unlisted books on a card for the coordinator. At noon, hand the register and desk key to the next volunteer, and mention any books waiting for collection.",
    "At closing": "At 16:00, bring in the sign, switch off the desk lamp and return the key to the blue lockbox.",
}


def trunk(s: Session) -> Fork:
    s.started()
    s.stop()
    asked = s.user("Please make a Cedar Lantern welcome desk document for our Volunteer handbook. The field notes and an approved short draft are in the project; ask me which source to use.")
    todo = s.made("todo", "create", "Document the Cedar Lantern welcome desk", "--brief", "Use the source the visitor chooses and put the document in the Volunteer handbook")
    collection = s.made("collection", "create", "Volunteer handbook", "--brief", "The Cedar Lantern volunteers' opening and handover guidance")
    s.reply(asked, "I found both sources. I'll use the one you choose, then put the document in the Volunteer handbook and link it to this request.")
    question = s.ask("Which source should I use for the welcome desk document?", f"todo:{todo}",
                     {"Write from the field notes": "Build the guide chapter by chapter from the notes",
                      "File the approved draft": "File the ready text as a document with its existing chapters"})
    return Fork(question, {"todo": todo, "collection": collection, "request": asked})


def finish_document(s: Session, sequence: str, doc: int, fork: Fork, conclusion: str) -> None:
    about = f"doc:{doc}"
    s.follow(sequence, about)
    s.journal("collection", "all")
    s.journal("collection", "add", str(fork.rows["collection"]), about)
    s.onward(sequence, about)
    s.follow(sequence, about)
    s.journal("doc", "link", str(doc), f"message:{fork.rows['request']}")
    s.journal("doc", "link", str(doc), f"todo:{fork.rows['todo']}")
    s.onward(sequence, about)
    s.follow(sequence, about)
    s.onward(sequence, about)
    s.follow(sequence, about)
    s.say(f"{conclusion}\n\ndoc {doc}")
    s.onward(sequence, about)
    s.journal("todo", "done", str(fork.rows["todo"]), "--how", "The welcome desk document is in the Volunteer handbook and linked to the visitor's request")
    s.stop()


def from_notes(s: Session, fork: Fork) -> None:
    s.journal("todo", "start", str(fork.rows["todo"]))
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
    finish_document(s, WRITING, doc, fork, "The guide now covers opening, the noon handover and closing. It is in the Volunteer handbook.")


def approved_draft(s: Session, fork: Fork) -> None:
    s.journal("todo", "start", str(fork.rows["todo"]))
    s.shell("sed -n '1,16p' drafts/welcome-desk.md")
    doc = s.made("doc", "file", "Cedar Lantern welcome desk", "drafts/welcome-desk.md")
    finish_document(s, FILING, doc, fork, "The approved draft is filed with its opening, desk and closing chapters in the Volunteer handbook.")


BRANCHES = {"Write from the field notes": from_notes, "File the approved draft": approved_draft}
