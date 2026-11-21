package host

import (
	"os/exec"
	"strconv"
	"strings"
)

// psStartTime is a process's start time as ps reports it, where /proc is not there, as on macOS.
func psStartTime(pid int) (string, error) {
	output, err := exec.Command("/bin/ps", "-o", "lstart=", "-p", strconv.Itoa(pid)).Output()

	return strings.TrimSpace(string(output)), err
}
