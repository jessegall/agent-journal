from journal.features.etiquette.etiquette_conduct import EtiquetteConduct
from journal.features.etiquette.support.etiquette_data_reader import EtiquetteDataReader
from journal.features.etiquette.support.etiquette_data import EtiquetteData
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.support.skill import Skill


class Etiquette(Feature[EtiquetteData]):
    PLAIN_CODE_INTERVAL = Option("etiquette.plain_code_every", "Remind to write code in plain words every", "Edits of code files between reminders that names and text in code are plain words, never the voice", 50, unit="edits")
    REMINDER_INTERVAL = Option("etiquette.remind_every", "Remind what a journal line is every", "Lines the journal says to the agent between reminders that a journal line is an instruction, not a message", 50, unit="lines")
    name = "etiquette"
    title = "Chat etiquette"
    help = "Shop talk and the third person in the chat are named, and code is kept in plain words."
    skill = Skill("etiquette", "How to behave in the chat with the user, and where the voice stops; load it first in every session, after the journal skill", """
# Chat etiquette

Everything you write for the user reaches the chat. These are the rules for it.

- You speak to the user. Say "you", never "the user" or their name in the third person.
- A line that starts with [journal] is an instruction from the journal, not a message from the user. Act on it.
  Never answer it, quote it or mention it in the chat.
- Talk about the work. Never talk about the journal's own mechanics in the chat: its lines, hooks, skills, holds,
  replies or logging. Never announce that you are reading, replying, loading or logging something; just do it.
  Tell the user what they need to know: a failure, finished work, a decision that waits on them.
- Answer in as few words as the answer needs. One thought to a paragraph, with a blank line between paragraphs.
- No em dashes.
- Words meant for the user are text in the chat or a `journal message send`, never only in your thinking.
- Say a reply once. A reply sent by command is not repeated in the closing text of the turn.

## The voice

The voice the user picked shapes only your tone in the chat and how you address the user. It stops there.

- Code, names, comments, commit messages, documents, plans, reports, task briefs and worker briefs are always plain
  words that say literally what a thing is or does, in the user's own language, such as plain English or plain Dutch.
- Never carry the voice's words into a name, a docstring or a document: no metaphors, no dressed-up phrases.
- In the chat, still say worker, subagent, task and environment, whatever the voice.
""")
    data = (EtiquetteDataReader,)
    conduct = (EtiquetteConduct,)

    SHOP_TALK_WARNING = Nudge(name, "no_shop_talk", "your message talks about the journal's commands", "talk about the work; the journal's lines are instructions to you, not news for the user", repeat_interval=600, is_remark=True)
    SECOND_PERSON = Nudge(name, "say_you_not_the_user", "in the chat you are speaking to the user", "say you, never the user", repeat_interval=600, is_remark=True)
    EM_DASH_WARNING = Nudge(name, "no_em_dashes", "your chat used em dashes", "write to the user as a person would: short sentences, a full stop where the dash was", repeat_interval=600, is_remark=True)
    PARAGRAPH_SPACING = Nudge(name, "blank_lines_between_paragraphs", "your last message had no blank lines between paragraphs", "a blank line between parts is what makes a message readable: one thought to a paragraph", repeat_interval=600, is_remark=True)
    JOURNAL_LINE_RULE = Nudge(name, "a_line_is_an_instruction", "chat etiquette: a line from the journal is an instruction, not a message", "act on it or note it, never answer or mention it in the chat; what the user needs to know still goes to the chat", repeat_interval=1800, is_remark=True)
    PLAIN_CODE = Nudge(name, "plain_words_in_code", "names and text in code are plain words", "every name, string and comment says literally what a thing is or does, in the user's own plain language, never in the voice", repeat_interval=0)
    nudges = (SHOP_TALK_WARNING, SECOND_PERSON, EM_DASH_WARNING, PARAGRAPH_SPACING, JOURNAL_LINE_RULE, PLAIN_CODE)
    options = (REMINDER_INTERVAL, PLAIN_CODE_INTERVAL)
