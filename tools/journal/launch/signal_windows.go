package launch

import "os"

// signalGroup ends the program; Windows has no process group to signal.
func signalGroup(pid int, forced bool) {
	if process, err := os.FindProcess(pid); err == nil {
		_ = process.Kill()
	}
}
