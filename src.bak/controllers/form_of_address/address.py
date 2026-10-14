from controllers.form_of_address.controller import Profiles
from resources.voices import Voice
from resources.base import SYSTEM


def voice_of(record) -> Voice:
    return Profiles(record, actor=SYSTEM).standing()
