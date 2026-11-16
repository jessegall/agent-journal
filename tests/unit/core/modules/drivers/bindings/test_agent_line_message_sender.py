from types import SimpleNamespace


CONTEXT = SimpleNamespace(actor=SimpleNamespace(id=1))


class SavingRepository:
    def save(self, row, context):
        return row


