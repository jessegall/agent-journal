def program_flags(provider: str) -> list[str]:
    # @sin ProviderNameComparedDetector
    return ["--no-daemon"] if provider == "codex" else []


def is_dispatch(tool: str) -> bool:
    # @sin ProviderNameComparedDetector
    return tool in ("Agent", "Task")


# @sin ProviderKeyedTableDetector
RESUME = {"claude": "--resume", "codex": "resume"}


def flags(provider) -> list[str]:
    # @righteous ProviderNameComparedDetector
    return list(provider.prompt_flags)


def title(provider) -> str:
    # @righteous ProviderKeyedTableDetector
    return {"name": provider.name}["name"]
