from journal.features.feature import Feature
from journal.support.skill import Skill
from journal.features.templates.commands.template_command import TemplateCommand
from journal.features.templates.seeds.builtin_templates import BuiltinTemplates


class TemplatesFeature(Feature):
    name = "templates"
    title = "Templates"
    help = "Saved instructions and a starting outline for new items; the critique templates are offered on a plan."
    commands = (TemplateCommand,)
    seeds = (BuiltinTemplates,)

    skill = Skill("templates", 'Load it when something is to be made from a template, or a template is written, or the user asks for a critique that names one', """
# Templates

A template is written once and used many times: its brief holds the instructions you read before working on
anything made from it, and its parts are the outline a new item starts with.

- `journal template list` names them; `journal template show <n>` prints the instructions and the outline.
  Read the template before you start, and follow its instructions to the letter.
- `journal template create "<title>" --brief "<instructions>" --applies-to plan --purpose critique --parts "title: body | title: body"` writes one.
- The plan page asks for a critique naming a template: give the plan that reading, and put what you find in a
  report linked to the plan.
""", keywords=('template', 'templates', 'critique'))
