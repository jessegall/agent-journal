from controllers.types import Styles
from features.base import Feature, event
from resources.base import SYSTEM
from skills import LIBRARY, link, unlink


class Style(Feature):
    name = "style"
    runs_for_subagents = True
    title_ = "Coding style"
    abstract_ = "Every style rule is written as a skill the agent loads before writing code on its subject"
    help_ = ".agents/skills/style-<subject>/SKILL.md is rewritten on every change to the rule, linked for Claude, and removed when it is struck."

    @event("style")
    def write(self, event, record) -> None:
        rule = Styles(record, actor=SYSTEM).load(event.n)
        if not rule.subject:
            return
        project = record.root.parent
        name = f"style-{rule.subject}"
        folder = project / LIBRARY / name
        skill = folder / "SKILL.md"
        if rule.completed or rule.deleted:
            unlink(project, name)
            return
        folder.mkdir(parents=True, exist_ok=True)
        link(project, name)
        head = f"---\nname: style-{rule.subject}\ndescription: {rule.title}: {rule.decision or ''}\n---\n\n# {rule.title}\n\n**The rule here:** {rule.decision or ''}\n"
        when = f"\nApplies to {rule.when}.\n" if rule.when else ""
        body = f"\n{rule.brief}\n" if rule.brief else ""
        skill.write_text(head + when + body)
