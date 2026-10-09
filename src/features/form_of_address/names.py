from engine import runtime
from features.form_of_address.details import FormOfAddressDetails
from features.form_of_address.voices import Calling


def first_name(record) -> str:
    return str(FormOfAddressDetails.values(record).first_name).strip() or (runtime.git_user(record.root).split() or [""])[0]


def title(record) -> str:
    return str(FormOfAddressDetails.values(record).title).strip()


def called(record) -> str:
    return Calling.TITLE_AND_NAME.called(title(record), first_name(record))


def in_use(record) -> int:
    chosen = FormOfAddressDetails.values(record).profile
    return int(chosen) if str(chosen).isdigit() else 0
