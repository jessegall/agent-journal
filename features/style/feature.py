from controllers.types import CONTROLLERS
from features.base import Feature, on
from resources.base import SYSTEM


class Style(Feature):
    name = "style"
    title_ = "Coding style"
    abstract_ = "Every style rule is written as a skill the agent loads before writing code on its subject"
    help_ = ".claude/skills/style-<subject>/SKILL.md is rewritten on every change to the rule and removed when it is struck."

    @on("style")
    def write(self, event, record) -> None:
        rule = CONTROLLERS["style"](record, actor=SYSTEM).load(event.n)
        if not rule.data.get("subject"):
            return
        folder = record.root.parent / ".claude" / "skills" / f"style-{rule.data['subject']}"
        skill = folder / "SKILL.md"
        if rule.completed or rule.deleted:
            if skill.is_file():
                skill.unlink()
                folder.rmdir()
            return
        folder.mkdir(parents=True, exist_ok=True)
        head = f"---\nname: style-{rule.data['subject']}\ndescription: {rule.title}: {rule.data.get('decision', '')}\n---\n\n# {rule.title}\n\n**The rule here:** {rule.data.get('decision', '')}\n"
        when = f"\nApplies to {rule.data['when']}.\n" if rule.data.get("when") else ""
        body = f"\n{rule.brief}\n" if rule.brief else ""
        skill.write_text(head + when + body)
