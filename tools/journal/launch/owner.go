package launch

import (
	"errors"
	"os"
	"strconv"
)

// ErrLauncherRuns is the refusal to take the socket of a launcher whose process runs but does not answer.
var ErrLauncherRuns = errors.New("the launcher that serves this socket runs and does not answer")

// ownerLink is the link beside the public socket whose target is the process number of the launcher serving it, so
// the server and a starting launcher can tell a launcher that is slow from one that is gone without opening a file.
func ownerLink(path string) string {
	return path + ".pid"
}

func writeOwner(path string) {
	link := ownerLink(path)
	_ = os.Remove(link)
	_ = os.Symlink(strconv.Itoa(os.Getpid()), link)
}

func removeOwner(path string) {
	if target, err := os.Readlink(ownerLink(path)); err == nil && target == strconv.Itoa(os.Getpid()) {
		_ = os.Remove(ownerLink(path))
	}
}

func ownerRuns(path string) bool {
	target, err := os.Readlink(ownerLink(path))
	if err != nil {
		return false
	}
	pid, err := strconv.Atoi(target)
	return err == nil && processRuns(pid)
}
