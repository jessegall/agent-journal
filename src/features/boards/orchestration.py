from features.boards.details import BoardsDetails


def orchestrating(record) -> bool:
    return bool(BoardsDetails.values(record).orchestrating)


def orchestration(record) -> str:
    if not orchestrating(record):
        return ""
    return ("ORCHESTRATING: this environment's agent runs its boards and only delegates; every ticket's work is done by that "
            "ticket's own agent. journal board orchestrate off returns you to your own work.")


def filler_model(record, provider: str) -> str:
    return BoardsDetails.values(record).filler_model.get(provider, "")
