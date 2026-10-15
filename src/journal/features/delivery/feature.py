from journal.features.delivery.listeners.confirm_typed import ConfirmTyped
from journal.features.delivery.listeners.retype_lost import RetypeLost
from journal.features.feature import Feature


class Delivery(Feature):
    name = "delivery"
    title = "Delivery"
    help = "A line the journal types is confirmed by the prompt that brings it back; one that has not come back while the agent sits between turns is typed again, three times at most, and the chat says so."
    listeners = (ConfirmTyped, RetypeLost)
