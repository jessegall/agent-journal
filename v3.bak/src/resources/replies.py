"""The words that tell what a message asks of whoever reads it: a question to answer, or only a nod."""

import re

ASKING = re.compile(r"\?|\b(?:relay|reply|answer me|tell me|let me know|what do you think|do you (?:think|agree|understand)|your (?:opinion|view|take)"
                    r"|geef (?:het |dit |dat )?door|reageer|antwoord (?:me|mij)|vertel (?:me|mij)|laat (?:het )?(?:me|mij) weten|wat (?:denk|vind) je"
                    r"|denk je|ben je het (?:ermee )?eens|begrijp je|snap je|jouw (?:mening|kijk|idee))\b", re.I)


NODS = r"ok(?:ay|é)?|thanks?(?: you)?|got it"
ACKNOWLEDGING = re.compile(rf"^\W*(?:{NODS}|thx|cool|nice|great|perfect|splendid|sure|sounds good|good|top|prima|mooi"
                           r"|dank(?:je|jewel| je| u)?|bedankt|helemaal goed|lekker)\b[\W\s]*(?:sir|jesse|man)?[\W\s]*$", re.I)
