package device

import (
	"maps"
	"path/filepath"
)

// InstalledPlanNames fills a connected release's host placeholders from its installation and sealed programs.
func InstalledPlanNames(journalURL, installation string, programs map[string]string) map[string]string {
	names := PlanNames(journalURL, installation,
		filepath.Join(installation, "bin", "journal-hook"),
		filepath.Join(installation, "bin", "journal-runner"),
	)
	maps.Copy(names, programs)
	return names
}

// PlanNames gives a plan the host paths the running service provides.
func PlanNames(journalURL, installation, hook, runner string) map[string]string {
	names := map[string]string{"JOURNAL_URL": journalURL}
	if installation != "" {
		names["INSTALLATION"] = installation
	}
	if hook != "" {
		names["HOOK_COMMAND"] = hook
	}
	if runner != "" {
		names["JOURNAL_RUNNER"] = runner
	}
	return names
}
