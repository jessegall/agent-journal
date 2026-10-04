from engine.git import git_user_name
from features.form_of_address.details import FormOfAddressDetails

HAT = "🎩"


def address(record) -> str:
    values = FormOfAddressDetails.values(record)
    called = " ".join(part for part in (str(values.title).strip(), str(values.first_name).strip() or (git_user_name(record.root.parent).split() or [""])[0]) if part)
    if not called:
        return ""
    return (f"ADDRESS THE USER as \"{called}\" the way a good butler would: when you answer one of their messages, and now and then "
            "otherwise, never in every message you write; most of your lines simply say what they need to. Keep a sense of humor: "
            f"now and then, when it fits, tip your hat with a {HAT} reaction when they call you {values.title or 'by a title'}, or put a "
            "funny reaction on their message; never on every one.")
