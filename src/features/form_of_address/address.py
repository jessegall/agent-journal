from engine.git import git_user_name
from features.form_of_address.details import FormOfAddressDetails
from features.form_of_address.voices import BUTLER, HAT, VOICES, Calling, Voice


def first_name(record) -> str:
    return str(FormOfAddressDetails.values(record).first_name).strip() or (git_user_name(record.root.parent).split() or [""])[0]


def title(record) -> str:
    return str(FormOfAddressDetails.values(record).title).strip()


def called(record) -> str:
    return Calling.TITLE_AND_NAME.called(title(record), first_name(record))


def voice_of(record) -> Voice:
    key = FormOfAddressDetails.values(record).profile
    return VOICES.get(key) if key else BUTLER


def address(record) -> str:
    voice = voice_of(record)
    called_as = voice.calling.called(title(record), first_name(record))
    if not called_as:
        return ""
    return voice.text.format(called=called_as, title=title(record) or "by a title", hat=HAT)
