from features.form_of_address.controller import Profiles
from features.form_of_address.names import first_name, in_use, title
from features.form_of_address.voices import BUTLER, Voice
from resources.base import SYSTEM, Refused


def voice_of(record) -> Voice:
    try:
        return Profiles(record, actor=SYSTEM).voice(in_use(record))
    except (ValueError, Refused):
        return BUTLER


def address(record) -> str:
    voice = voice_of(record)
    instruction = voice.calling.instruction(voice.calling.called(title(record), first_name(record)))
    return f"HOW THE USER WANTS YOU TO TALK, in their own words: {voice.text} {instruction}".strip()
