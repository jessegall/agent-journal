package main

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/jessegall/agent-journal/tools/journal-hook/filescan"
)

// editLookBack is how long before its post tool use hook an edit tool may have written: a first scan of a project
// counts a file modified since then as the edit's own.
const editLookBack = 30 * time.Second

// ScanFiles runs detached after a shell line or an edit tool: it reads what changed in the project of the journal at
// home, or in the worktree of a worker working in folder, and hands each change to the journal, for the agent the owner
// flag names, and goes round again for a line that ended meanwhile. A first scan counts what changed from since on.
func ScanFiles(home, ownerFlag, owner, folder string, since time.Time) {
	root := filescan.ScanRoot(home, folder)
	state := filescan.StateFolder(home, root)
	if !filescan.Acquire(state) {
		return
	}
	defer filescan.Release(state)
	for {
		changes, err := filescan.Scan(root, state, since)
		if err == nil && len(changes) > 0 {
			handOver(home, ownerFlag, owner, state, filescan.Report{Folder: root, Changes: changes})
		}
		if !filescan.MustRepeat(state) {
			return
		}
	}
}

// scanSince is the moment the file scan arguments name in Unix nanoseconds after the folder, or none.
func scanSince(arguments []string) time.Time {
	if len(arguments) == 0 {
		return time.Time{}
	}
	nanoseconds, err := strconv.ParseInt(arguments[0], 10, 64)
	if err != nil {
		return time.Time{}
	}
	return time.Unix(0, nanoseconds)
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
	since := strconv.FormatInt(time.Now().Add(-editLookBack).UnixNano(), 10)
	command := exec.Command(program, "--file-scan", filepath.Join(root, ".journal"), "--session", prepared.Session, folder, since)
	detach(command)
	_ = command.Start()
}
