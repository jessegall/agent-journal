from features.form_of_address.controller import Profiles
from features.form_of_address.names import first_name, title
from features.form_of_address.voices import PLAIN_WORDS, Voice
from resources.base import SYSTEM


def voice_of(record) -> Voice:
    return Profiles(record, actor=SYSTEM).standing()


def address(record) -> str:
    voice = voice_of(record)
    instruction = voice.calling.instruction(voice.calling.called(title(record), first_name(record), voice.address))
    text = " ".join(part for part in (voice.text, instruction, voice.humour, PLAIN_WORDS) if part)
    return f"HOW THE USER WANTS YOU TO TALK, in their own words: {text}"
