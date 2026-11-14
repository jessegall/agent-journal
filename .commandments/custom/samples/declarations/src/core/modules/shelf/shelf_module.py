from engine.module.module import Module


class ShelfModule(Module):
    # @sin architecture_modules_inline_declaration
    tick_handlers = [TickHandler(TickInterval(seconds=60), ShelfSweep(), "shelf sweep")]
    # @righteous architecture_modules_inline_declaration
    handlers = [ShelfHandler, ShelfCloseHandler]
