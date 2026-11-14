from core.modules.plans.models.phase import Phase


def moved(phase: Phase) -> Phase:
    # @sin architecture_views_position_outside_positions
    return phase.changed(position=phase.position + 1)


def renamed(phase: Phase) -> Phase:
    # @righteous architecture_views_position_outside_positions
    return phase.changed(title="Build")
