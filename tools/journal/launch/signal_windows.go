package launch

import "os"

// signalGroup ends the program; Windows has no process group to signal.
func signalGroup(pid int, forced bool) {
	if process, err := os.FindProcess(pid); err == nil {
		_ = process.Kill()
	}
}

// processRuns is never true on Windows, where no launcher serves a socket.
func processRuns(pid int) bool {
	return false
}
