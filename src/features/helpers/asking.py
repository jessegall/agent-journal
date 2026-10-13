from resources.reuse import subagent_rows


def listed_options(question) -> str:
    if not question.options:
        return "It offers no options, so answer it in your own words."
    titles = [option["title"] if isinstance(option, dict) else str(option) for option in question.options]
    return "Options: " + "; ".join(f"{at}. {title}{' (its pick)' if question.pick == at else ''}" for at, title in enumerate(titles, 1)) + "."


def subagent_name(primary, address: str) -> str:
    task = next((sub.task for sub in subagent_rows(primary) if sub.address == address), "") if primary else ""
    return task.partition(":")[0].strip() or address
