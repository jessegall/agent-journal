// Command journal is the journal command of a machine connected to a server journal. It finds the connected folder
// it runs in, keeps that folder's relay running and answers status; the other verbs arrive with the next release.
package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"journal-agent/host"
	"journal-agent/project"
)

func main() {
	folder, err := os.Getwd()
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal:", err)
		os.Exit(1)
	}
	dispatcher := dispatcher{stateFolder: host.DefaultStateFolder(), wake: wakeRelay}
	answer, err := dispatcher.run(os.Args[1:], folder)
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal:", err)
		os.Exit(1)
	}
	fmt.Println(answer)
}

// errVerbLater refuses a verb this connected machine does not run yet.
var errVerbLater = errors.New("this verb arrives with the next release; a connected machine answers status for now")

// dispatcher resolves the connected folder of each invocation and its binding; one dispatcher serves every
// connected folder of the machine.
type dispatcher struct {
	stateFolder string
	wake        func(stateFolder string, bindingID string) error
}

// run resolves the folder's binding, wakes its relay when none runs and answers the verb.
func (dispatcher dispatcher) run(arguments []string, folder string) (string, error) {
	found, connection, err := project.Find(folder)
	if errors.Is(err, project.ErrNotConnected) {
		return "Not connected: no connected project folder holds " + folder + ".", nil
	}
	if err != nil {
		return "", err
	}

	state, binding, err := host.ConnectionOfBinding(dispatcher.stateFolder, connection.BindingID)
	if errors.Is(err, host.ErrNotConnected) || binding.RootID != connection.RootID {
		return "Not connected: this machine holds no connection for " + found.Root + ".", nil
	}
	if err != nil {
		return "", err
	}
	if binding.CanonicalRoot != found.Root {
		return "", fmt.Errorf("%w: it was connected at %s and is now at %s; connect this folder with a new install line",
			project.ErrRootMoved, binding.CanonicalRoot, found.Root)
	}

	if !state.RelayIsRunning() {
		if err := dispatcher.wake(dispatcher.stateFolder, binding.BindingID); err != nil {
			return "", err
		}
	}

	if len(arguments) == 0 || arguments[0] != "status" {
		return "", errVerbLater
	}

	return status(binding, state, found), nil
}

// status is the one line journal status answers.
func status(binding host.Binding, state host.ConnectionState, folder project.Folder) string {
	contact := "no contact yet"
	if report, err := state.RelayReport(); err == nil {
		contact = "last contact " + report.ReportedAt.Local().Format(time.DateTime)
	}
	return fmt.Sprintf("Connected to %s · %s · %s · %s",
		binding.JournalURL, filepath.Base(folder.Root), host.MachineLabel(), contact)
}

// wakeRelay starts the binding's relay with the journal-agent installed beside this command.
func wakeRelay(stateFolder string, bindingID string) error {
	program, err := os.Executable()
	if err != nil {
		return err
	}
	program, err = filepath.EvalSymlinks(program)
	if err != nil {
		return err
	}

	return host.StartRelay(filepath.Join(filepath.Dir(program), "journal-agent"), stateFolder, bindingID)
}
