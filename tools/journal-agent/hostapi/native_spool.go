package hostapi

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"syscall"
	"time"
)

// spoolName is the file in a process's own folder that a native process without a terminal prints its standard
// output to, so what it prints outlives the host that started it.
const spoolName = "stdout"

// spoolPollInterval is how often a followed spool is read again once it was read to its end.
const spoolPollInterval = 25 * time.Millisecond

// openSpool opens the process's spool for its next start to print to, after what an earlier start printed.
func openSpool(stateFolder, processID string) (*os.File, error) {
	folder := filepath.Join(stateFolder, "processes", processID)
	if err := os.MkdirAll(folder, 0o700); err != nil {
		return nil, err
	}
	return os.OpenFile(filepath.Join(folder, spoolName), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o600)
}

// followSpool sends what the native process prints to its spool from the offset on, until it finished and the spool
// was read to its end; its exit is reported only after that.
func (table *ProcessTable) followSpool(held *heldProcess, from int64) {
	drained := make(chan struct{})
	held.drained = drained
	go func() {
		defer close(drained)
		spool, err := os.Open(filepath.Join(table.stateFolder, "processes", held.id, spoolName))
		if err != nil {
			return
		}
		defer func() { _ = spool.Close() }()
		if _, err := spool.Seek(from, io.SeekStart); err != nil {
			return
		}
		table.readSpool(held, spool)
	}()
}

// readSpool reads the spool as it grows; once the process finished, one last read takes what it printed before.
func (table *ProcessTable) readSpool(held *heldProcess, spool io.Reader) {
	buffer := make([]byte, 32*1024)
	isLastRead := false
	for {
		count, err := spool.Read(buffer)
		if count > 0 {
			table.outputs.Printed(held.id, append([]byte(nil), buffer[:count]...))
			continue
		}
		if isLastRead || (err != nil && !errors.Is(err, io.EOF)) {
			return
		}
		select {
		case <-held.finished:
			isLastRead = true
		case <-time.After(spoolPollInterval):
		}
	}
}

// adoptNative takes back a native process the host started before it restarted: its spool is followed on from what
// was already counted, and its end is reported once its process group is gone, with no exit code, since it is no
// longer this host's child.
func (table *ProcessTable) adoptNative(held *heldProcess, pid int) {
	held.pid = pid
	held.finished = make(chan struct{})
	held.setIdentity(fmt.Sprintf("pid:%d", pid))
	table.followSpool(held, table.outputs.SpoolOffset(held.id))
	table.keep(held)
	go table.watchAdopted(held)
}

// watchAdopted waits until the adopted process group is gone and reports its end after its spool was read.
func (table *ProcessTable) watchAdopted(held *heldProcess) {
	for isGroupAlive(held.pid) {
		time.Sleep(spoolPollInterval)
	}
	held.finish()
	held.awaitDrained()
	table.end(held, ProcessReport{ProcessID: held.id, Report: "exited",
		Evidence: "the process ended while a restarted host followed it, so its exit code is unknown"})
}

// isGroupAlive answers whether a process of the group the pid leads still runs. The group's first process ended
// when it waits only to be reaped, as it does once the host that started it died and nothing reaps orphans.
func isGroupAlive(pid int) bool {
	return syscall.Kill(-pid, 0) == nil && !isZombie(pid)
}

// isZombie answers whether the process ended and waits only to be reaped, as /proc tells on Linux; where there is no
// /proc it never is.
func isZombie(pid int) bool {
	stat, err := os.ReadFile(fmt.Sprintf("/proc/%d/stat", pid))
	if err != nil {
		return false
	}
	end := bytes.LastIndexByte(stat, ')')
	return end >= 0 && end+2 < len(stat) && stat[end+2] == 'Z'
}

// canOutliveHost answers whether the process runs on when the host stops: a container, or a native process without a
// terminal, which prints to its spool.
func (held *heldProcess) canOutliveHost() bool {
	return held.plan.Container != nil || (held.pid != 0 && held.plan.Type != "terminal")
}

// finish marks a native process as ended for good, once.
func (held *heldProcess) finish() {
	if held.finished == nil {
		return
	}
	select {
	case <-held.finished:
	default:
		close(held.finished)
	}
}
