from controllers.form_of_address.controller import Profiles
from resources.voices import PLAIN_WORDS, Voice
from resources.base import SYSTEM


def voice_of(record) -> Voice:
    return Profiles(record, actor=SYSTEM).standing()


def address(record) -> str:
    voice = voice_of(record)
    profiles = Profiles(record, actor=SYSTEM)
    instruction = voice.calling.instruction(voice.calling.called(profiles.user_title(), profiles.user_first_name(), voice.address))
    text = " ".join(part for part in (voice.text, instruction, voice.humour, voice.reacts(), PLAIN_WORDS) if part)
    return f"HOW THE USER WANTS YOU TO TALK, in their own words: {text}"
