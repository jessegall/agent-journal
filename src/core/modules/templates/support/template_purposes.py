from core.modules.templates.support.template_purpose import TemplatePurpose

CRITIQUE_PROMPT = ("Please have {agents} give {target} {size}, following template {id} ({title}), and compile what they find "
                   "into a report linked to the {type}.")
DEFAULT_PROMPT = "Please follow template {id} ({title}) on {target}."
PURPOSES = {"critique": TemplatePurpose(CRITIQUE_PROMPT, "review")}
PLAIN_PURPOSE = TemplatePurpose(DEFAULT_PROMPT)
