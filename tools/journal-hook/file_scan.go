package main

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/filescan"
)

// ScanFiles runs detached after a shell line or an edit tool: it reads what changed in the checkout of folder and
// hands each change to the journal, for the agent the owner flag names, and goes round again for a line that ended
// meanwhile.
func ScanFiles(home, ownerFlag, owner, folder string) {
	root, inRepository := filescan.RepositoryRoot(folder)
	if !inRepository {
		return
	}
	state := filescan.StateFolder(home, root)
	if !filescan.Acquire(state) {
		return
	}
	defer filescan.Release(state)
	for {
		changes, err := filescan.Scan(root, state)
		if err == nil && len(changes) > 0 {
			handOver(home, ownerFlag, owner, state, filescan.Report{Folder: root, Changes: changes})
		}
		if !filescan.MustRepeat(state) {
			return
		}
	}
}

// handOver leaves the report beside the scan's state and tells the journal to record it.
func handOver(home, ownerFlag, owner, state string, report filescan.Report) {
	content, err := json.Marshal(report)
	if err != nil {
		return
	}
	path := filescan.ReportPath(state)
	if os.WriteFile(path, content, 0o600) != nil {
		return
	}
	_ = exec.Command(filepath.Join(home, "bin", "journal"), "file-edit", "record-changes", path, ownerFlag, owner).Run()
}

// scanAfterEdit leaves a scan behind when an edit tool has written; no hook records an edit itself.
func scanAfterEdit(root string, prepared event.HookEvent) {
	if prepared.Event != "post_tool_use" || prepared.Tool == nil || prepared.Tool.Diff == nil {
		return
	}
	folder, err := os.Getwd()
	if err != nil {
		return
	}
	program, err := os.Executable()
	if err != nil {
		return
	}
	command := exec.Command(program, "--file-scan", filepath.Join(root, ".journal"), "--session", prepared.Session, folder)
	detach(command)
	_ = command.Start()
}
