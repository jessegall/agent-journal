package launch

import (
	"fmt"
	"os/exec"
	"runtime"
	"strings"
)

// HeaderBar is the line the launcher prints above the agent program: where the agent works, its number and the link that
// opens the viewer on it, so the person never has to ask for the link.
func HeaderBar(environment string, agentID int, link string) string {
	return fmt.Sprintf("journal · %s · agent %d · viewer %s", environment, agentID, link)
}

// OpenCommand is the program that opens a link in the person's browser on this system.
func OpenCommand(system string) string {
	switch system {
	case "darwin":
		return "open"
	case "windows":
		return "explorer"
	}
	return "xdg-open"
}

// OpenViewer opens the link in the browser, once; a failure is told in a line and goes no further.
func OpenViewer(link string, start func(program string, arguments ...string) error) string {
	if strings.TrimSpace(link) == "" {
		return ""
	}
	if err := start(OpenCommand(runtime.GOOS), link); err != nil {
		return fmt.Sprintf("the viewer could not be opened: %v", err)
	}
	return ""
}

// StartDetached starts a program and does not wait for it.
func StartDetached(program string, arguments ...string) error {
	return exec.Command(program, arguments...).Start()
}
