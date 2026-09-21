from controllers.base import Controller
from resources import types
from controllers.todos import Todos


class Works(Controller):
    resource = types.Work

    def active(self):
        return next((w for w in self._standing() if not w.parked), None)

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        busy = self.active()
        if busy:
            self._refuse(f'work {busy.n} is open: end it with journal work end --how "<what landed>", '
                          f'or set it aside with journal work park "<why>", before starting another')
        if data.get(types.Work.todo):
            row = Todos(self.record, actor=self.actor).load(int(data[types.Work.todo]))
            if row.completed:
                self._refuse(f"todo {row.n} is already done")
            held = row.assigned or ""
            if held and held != self.agent:
                self._refuse(f"todo {row.n} is assigned to {held}; nobody else may take it")
        return super().create(title, abstract, brief, **data)
