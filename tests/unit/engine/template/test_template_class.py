from engine.module.module import Module
from engine.template.template_declaration import TemplateDeclaration


class StockCountTemplate(TemplateDeclaration):
    title = "Stock count"
    targets = ("plan",)
    purpose = "critique"
    brief = "Count what is on the shelves."


class ShopModule(Module):
    name = "shop"
    templates = [StockCountTemplate, TemplateDeclaration(title="Till check")]


def test_a_template_class_gives_the_declaration_the_inline_call_gave():
    assert StockCountTemplate.declared() == TemplateDeclaration(title="Stock count", targets=("plan",), purpose="critique", brief="Count what is on the shelves.")


def test_a_module_gives_the_declarations_of_its_template_classes_beside_its_inline_ones():
    assert [template.title for template in ShopModule.template_declarations()] == ["Stock count", "Till check"]
