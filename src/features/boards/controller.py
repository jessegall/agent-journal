import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, internal
from features.boards.resource import DONE, MEANINGS, Board
from resources.base import Refused, Resource


STAGES = ("To do", "Doing", "Review", "Done")


class Boards(Controller):
    resource = Board

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        opening = {} if data.get("stages") else {"stages": list(STAGES), "meanings": {STAGES[-1]: DONE}}
        return super().create(title, abstract, brief, **{**opening, **data})

    @internal
    def save(self, r: Resource, action: str, **event) -> Resource:
        stages = [str(stage) for stage in r.stages]
        if len(set(stages)) != len(stages):
            raise Refused("a board names each stage once")
        unknown = {stage: meaning for stage, meaning in r.meanings.items() if stage not in stages or meaning not in MEANINGS}
        if unknown:
            raise Refused(f"a stage of this board is marked {', '.join(MEANINGS)}; not {unknown}")
        return super().save(r, action, **event)

    def stage(self, n: int, name: str, meaning: str = ""):
        board = self.load(int(n))
        return self.update(board.n, stages=[*board.stages, name.strip()], meanings={**board.meanings, **({name.strip(): meaning} if meaning else {})})

    def meaning(self, n: int, stage: str, meaning: str = ""):
        board = self.load(int(n))
        kept = {name: marked for name, marked in board.meanings.items() if name != stage}
        return self.update(board.n, meanings={**kept, **({stage: meaning} if meaning else {})})


resources_module.register(Board)
types_module.register(Boards)
