package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"journal-agent/host"
	"journal-agent/project"
)

// terminalPath is the controlling terminal connect asks on before it uses the install line; never standard input,
// which carries the ticket and may be piped.
var terminalPath = "/dev/tty"

// errFolderNotConfirmed is returned when the user did not confirm the folder; nothing was connected.
var errFolderNotConfirmed = errors.New("the folder was not confirmed: nothing was connected and the install line was not used")

// errNoTerminal is returned when no terminal is open to confirm the folder on; the line was not used.
var errNoTerminal = errors.New("connecting asks on a terminal before it uses the install line, and none is open")

// errAlreadyConnected is returned for a folder this machine already connected; the new line was not used.
var errAlreadyConnected = errors.New("this folder is already connected")

// errDisconnectUnfinished is returned for a folder whose disconnect was cut short; the new line was not used.
var errDisconnectUnfinished = errors.New("this folder's disconnect is not finished")

// errFreshNotConfirmed is returned when the user did not confirm a fresh enrollment of a moved or copied folder.
var errFreshNotConfirmed = errors.New(
	"a fresh enrollment was not confirmed: nothing was connected and the install line was not used")

// targetFolder is the folder an install line connects: the root of the Git checkout it runs in, or the folder itself
// outside one, with every link resolved. Outside Git its children get no worktrees of their own.
type targetFolder struct {
	root  string
	isGit bool
}

// resolveTarget resolves the folder connect runs in to the folder it connects.
func resolveTarget() (targetFolder, error) {
	folder, err := os.Getwd()
	if err != nil {
		return targetFolder{}, err
	}
	printed, gitErr := exec.Command("git", "-C", folder, "rev-parse", "--show-toplevel").Output()
	isGit := gitErr == nil
	if isGit {
		folder = strings.TrimSpace(string(printed))
	}
	root, err := filepath.EvalSymlinks(folder)
	if err != nil {
		return targetFolder{}, err
	}

	return targetFolder{root: root, isGit: isGit}, nil
}

// assertNotConnected refuses a folder whose private state already holds a finished connection, naming that
// connection, so a fresh line is never spent on it; a connection whose setup was interrupted is resumed instead.
func (target targetFolder) assertNotConnected(state host.ConnectionState, out io.Writer) error {
	binding, err := state.Binding()
	if errors.Is(err, host.ErrNotConnected) {
		return nil
	}
	if err != nil {
		return err
	}
	if !(project.Folder{Root: target.root}).IsSetUp() {
		return nil
	}

	fmt.Fprintf(out, "This folder is already connected:\n  journal: %s\n  project: %s\n  binding: %s\n  folder:  %s\n",
		binding.JournalURL, binding.ProjectLabel, binding.BindingID, target.root)
	fmt.Fprintln(out, "The new install line was not used. To connect this folder to another journal, run journal disconnect first.")

	return errAlreadyConnected
}

// confirm shows the folder the line connects and asks on the controlling terminal; with no terminal it says how to
// go on and uses nothing.
func (target targetFolder) confirm(origin string, out io.Writer) error {
	fmt.Fprintf(out, "journal: this connects %s to %s\n", target.root, origin)
	if !target.isGit {
		fmt.Fprintln(out, "journal: this folder is not a Git checkout, so its agents get no worktrees of their own.")
	}

	return target.ask("Connect this folder? Type yes to go on: ", "yes", errFolderNotConfirmed)
}

// checkIdentity compares the folder's own journal files with this machine's private state before a line is spent. A
// disconnect cut short is finished first; a moved or copied folder shows the mismatch and, once a fresh enrollment
// is confirmed, loses only the journal setup it carried, keeping user files, worktrees and receipts; worktrees a
// disconnect kept are named and kept.
func (target targetFolder) checkIdentity(state host.ConnectionState, out io.Writer) error {
	folder := project.Folder{Root: target.root}
	if err := assertNoUnfinishedDisconnect(folder, state, out); err != nil {
		return err
	}

	identity := folder.IdentityAgainst(state)
	if identity == project.IdentityRetained {
		for _, path := range folder.RetainedWorktrees() {
			fmt.Fprintln(out, "journal: keeps "+path+", which an earlier disconnect left; it stays as it is.")
		}
		return nil
	}
	if identity != project.IdentityForeign {
		return nil
	}

	marker, _ := folder.Marker()
	fmt.Fprintf(out, "journal: %s holds journal setup made for binding %q in another place: the folder was moved or "+
		"copied. That setup is not resumed; your files and any worktrees stay.\n", target.root, marker.BindingID)
	if err := target.ask("Enroll this folder fresh, under its own identity? Type fresh to go on: ", "fresh",
		errFreshNotConfirmed); err != nil {
		return err
	}

	return folder.Disconnect()
}

// assertNoUnfinishedDisconnect refuses a folder whose disconnect, by its marker's binding or this root's own, was cut
// short, naming the command that finishes it.
func assertNoUnfinishedDisconnect(folder project.Folder, state host.ConnectionState, out io.Writer) error {
	bindings := []string{}
	if marker, err := folder.Marker(); err == nil {
		bindings = append(bindings, marker.BindingID)
	}
	if binding, err := state.Binding(); err == nil {
		bindings = append(bindings, binding.BindingID)
	}
	for _, bindingID := range bindings {
		if _, err := host.DisconnectOf(state.Folder, bindingID); err == nil {
			fmt.Fprintln(out, "journal: finish this folder's disconnect first with: journal disconnect --resume "+bindingID)
			return errDisconnectUnfinished
		}
	}

	return nil
}

// ask puts the question on the controlling terminal and goes on only for the expected answer; with no terminal it
// says how to go on and uses nothing.
func (target targetFolder) ask(question string, expected string, refusal error) error {
	terminal, err := os.OpenFile(terminalPath, os.O_RDWR, 0)
	if err != nil {
		return fmt.Errorf("%w: open a terminal in %s and run the install line there", errNoTerminal, target.root)
	}
	defer terminal.Close()

	fmt.Fprint(terminal, question)
	answer, _ := bufio.NewReader(terminal).ReadString('\n')
	if strings.ToLower(strings.TrimSpace(answer)) != expected {
		return refusal
	}

	return nil
}
