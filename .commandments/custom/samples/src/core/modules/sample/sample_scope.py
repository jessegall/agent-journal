from core.base.scope.actor_scope import ActorScope


class SampleListener:
    # @righteous architecture_scope_DisabledScopesOnlyDeclaredDetector
    disabled_scopes = [ActorScope]

    def open_up(self, listener):
        # @sin architecture_scope_DisabledScopesOnlyDeclaredDetector
        listener.disabled_scopes = []
