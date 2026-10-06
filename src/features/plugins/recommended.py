from dataclasses import dataclass
from pathlib import Path

from controllers.types import Plugins
from features.suggestions.controller import OPEN_SUGGESTIONS, Suggestions
from engine.events.agents import SessionStarted
from engine.worktree import lines
from features.parts import AgentContext, Handler
from resources.base import SYSTEM

LANGUAGES = {".php": "PHP", ".py": "Python", ".ts": "TypeScript", ".vue": "Vue", ".cs": "C#"}


@dataclass(frozen=True)
class Recommended:
    title: str
    source: str
    languages: frozenset
    does: str

    def suggestion(self) -> str:
        return f"Install the {self.title} plugin"


RECOMMENDED = (
    Recommended("Code Commandments", "https://github.com/jessegall/code-commandments", frozenset({"PHP", "Python", "TypeScript", "Vue", "C#"}),
                "judges the code against the project's own rules and teaches the agent the fix"),
)


def written_in(project: Path) -> set[str]:
    return {LANGUAGES[suffix] for suffix in {Path(name).suffix for name in lines(project, "ls-files")} if suffix in LANGUAGES}


class SuggestFittingPlugins(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        record = context.record
        installed = {row.source for row in Plugins(record, actor=SYSTEM).rows.every()}
        suggestions = Suggestions(record, actor=SYSTEM)
        made = {row.title for row in suggestions.rows.every()}
        waiting = [plugin for plugin in RECOMMENDED if plugin.source not in installed and plugin.suggestion() not in made]
        if not waiting or len(suggestions.rows.standing()) >= OPEN_SUGGESTIONS:
            return
        spoken = written_in(record.root.parent)
        for plugin in waiting:
            fits = sorted(spoken & plugin.languages)
            if fits:
                suggestions.create(plugin.suggestion(), brief=f"This project is written in {', '.join(fits)}. The {plugin.title} plugin {plugin.does}. "
                                                              f"Install it with journal plugin install {plugin.source}.")
