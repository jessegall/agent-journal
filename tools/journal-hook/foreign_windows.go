package main

import "os/exec"

func prepareManaged(command *exec.Cmd) {}

// detach does nothing on Windows, where the journal does not run yet.
func detach(command *exec.Cmd) {
}
