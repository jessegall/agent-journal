from engine.module.module import Module


class ShelfModule(Module):
    # @sin architecture_modules_inline_declaration
    # @sin architecture_modules_list_entry_not_a_class
    tick_handlers = [TickHandler(TickInterval(seconds=60), ShelfSweep(), "shelf sweep")]
    # @righteous architecture_modules_inline_declaration
    handlers = [ShelfHandler, ShelfCloseHandler]
    # @sin architecture_modules_list_entry_not_a_class
    windows = ["shelf.cart"]
    # @sin architecture_modules_list_entry_not_a_class
    subcommands = [("shelf", "list")]
    # @righteous architecture_modules_inline_declaration
    # @righteous architecture_modules_list_entry_not_a_class
    models = [ModelDeclaration(Shelf)]
    # @righteous architecture_modules_list_entry_not_a_class
    bindings = {ShelfReader: SqlShelfReader}
    # @righteous architecture_modules_list_entry_not_a_class
    name = "shelf"
