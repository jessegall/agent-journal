from engine.git import git_user_name
from features.form_of_address.details import FormOfAddressDetails

HAT = "🎩"


def first_name(record) -> str:
    return str(FormOfAddressDetails.values(record).first_name).strip() or (git_user_name(record.root.parent).split() or [""])[0]


def called(record) -> str:
    return " ".join(part for part in (str(FormOfAddressDetails.values(record).title).strip(), first_name(record)) if part)


def address(record) -> str:
    values = FormOfAddressDetails.values(record)
    called_as = called(record)
    if not called_as:
        return ""
    return (f"ADDRESS THE USER as \"{called_as}\" the way a good butler would: when you answer one of their messages, and now and then "
            "otherwise, never in every message you write; most of your lines simply say what they need to. Keep a sense of humor: "
            f"now and then, when it fits, tip your hat with a {HAT} reaction when they call you {values.title or 'by a title'}, or put a "
            "funny reaction on their message; never on every one.")
