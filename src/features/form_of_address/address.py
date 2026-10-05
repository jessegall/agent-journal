from engine.git import git_user_name
from features.form_of_address.details import FormOfAddressDetails
from features.form_of_address.voices import BUTLER, SHIPPED, Calling, Voice


def first_name(record) -> str:
    return str(FormOfAddressDetails.values(record).first_name).strip() or (git_user_name(record.root.parent).split() or [""])[0]


def called(record) -> str:
    return " ".join(part for part in (str(FormOfAddressDetails.values(record).title).strip(), first_name(record)) if part)


def voice_of(record) -> Voice:
    key = FormOfAddressDetails.values(record).profile
    return next((voice for voice in SHIPPED if voice.key == key), BUTLER)


def address(record) -> str:
    voice = voice_of(record)
    called_as = called(record) if voice.calling is Calling.TITLE_AND_NAME else first_name(record)
    if not called_as:
        return ""
    return voice.text.format(called=called_as, title=str(FormOfAddressDetails.values(record).title).strip() or "by a title")
