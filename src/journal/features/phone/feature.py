from journal.features.feature import Feature
from journal.features.phone.listeners.tell_the_phone import TellThePhone


class PhoneFeature(Feature):
    name = "phone"
    title = "Phone"
    help = "A phone paired through the tunnel reads and answers the journal from anywhere: the user shows a code on the computer, and the phone that opens it keeps a key for the days chosen."
    fixed = True
    listeners = (TellThePhone,)
