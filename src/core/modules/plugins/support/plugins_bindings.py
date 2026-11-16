from core.modules.plugins.support.plugin_installed_names import PluginInstalledNames
from core.modules.plugins.support.plugin_project_reads import PluginProjectReads
from core.modules.plugins.support.plugin_run_limits import PluginRunLimits
from core.modules.processes.support.installed_plugins import InstalledPlugins
from core.modules.processes.support.process_type_limits import ProcessTypeLimits
from engine.file.project_reads import ProjectReads

PLUGINS_BINDINGS = {ProjectReads: PluginProjectReads, ProcessTypeLimits: PluginRunLimits, InstalledPlugins: PluginInstalledNames}
