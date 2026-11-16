from core.modules.drivers.effects.compaction_wake_effect import CompactionWakeEffect
from core.modules.drivers.effects.project_hooks_effect import ProjectHooksEffect
from core.modules.drivers.effects.safeguards_stop_effect import SafeguardsStopEffect
from core.modules.drivers.effects.session_end_effect import SessionEndEffect
from core.modules.drivers.effects.use_permission_effect import UsePermissionEffect

DRIVERS_EFFECTS = [CompactionWakeEffect, ProjectHooksEffect, SafeguardsStopEffect, SessionEndEffect, UsePermissionEffect]
