from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.module.template_check import TemplateCheck
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.template.template_declaration import TemplateDeclaration
from tests.unit.core.base.model.test_model import Item


class WorkerList(ReadSubcommand):
    cli_name = "worker"
    name = "list"


class TemplateModule(Module):
    name = "acme.review"
    models = [ModelDeclaration(Item)]
    subcommands = [WorkerList]
    templates = [TemplateDeclaration(title="Review", targets=("item", "worker")),
                 TemplateDeclaration(title="Any target")]


class UnknownTargetModule(Module):
    name = "acme.unknown"
    templates = [TemplateDeclaration(title="Unknown target", targets=tuple(["nothing"]))]


class SameTitleModule(Module):
    name = "acme.other"
    templates = [TemplateDeclaration(title="Review")]


def test_targets_can_be_models_command_words_or_unrestricted():
    assert TemplateCheck().problems([TemplateModule]) == ()


def test_an_unknown_target_names_the_module_and_template():
    assert TemplateCheck().problems([UnknownTargetModule]) == (
        "the module acme.unknown's template Unknown target targets nothing, "
        "which is neither a model nor the first word of a command",
    )


def test_two_modules_cannot_register_one_title():
    assert TemplateCheck().problems([TemplateModule, SameTitleModule]) == (
        "the modules acme.review and acme.other both register the template Review",
    )
