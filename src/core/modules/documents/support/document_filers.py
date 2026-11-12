from engine.actor.actor import Actor


class DocumentFilers:
    """Says whether an actor may file or change a document: every actor may. A suite whose helpers file reports
    only binds its own."""

    def check(self, actor: Actor) -> None:
        return None
