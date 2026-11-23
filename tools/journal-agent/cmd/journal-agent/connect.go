package main

import (
	"bufio"
	"context"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"journal-agent/client"
	"journal-agent/host"
	"journal-agent/project"
)

// errTicketMissing is returned when standard input holds no install line ticket.
var errTicketMissing = errors.New("no install line ticket on standard input")

// errLineUnusable is the plain refusal of a ticket the journal would not redeem and no staged connection recovers.
var errLineUnusable = errors.New("this install line cannot be used: copy a new one from the journal")

// connect redeems an install line for the project folder it runs in. The ticket is read from standard input, never
// from an argument; the host credential is made here, kept in the private state folder and never printed. With
// --resume it finishes a staged install without its ticket; with --abandon it removes one the journal never committed.
func connect(arguments []string) error {
	flags := flag.NewFlagSet("connect", flag.ContinueOnError)
	ticketStdin := flags.Bool("ticket-stdin", false, "read the install line's ticket from standard input")
	resume := flags.Bool("resume", false, "finish this folder's staged install, without its ticket")
	abandon := flags.Bool("abandon", false, "remove this folder's staged install the journal never committed")
	origin := flags.String("origin", "", "the journal's canonical https origin")
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if !*resume && !*abandon && (!*ticketStdin || *origin == "") {
		return fmt.Errorf("usage: journal-agent connect --ticket-stdin --origin <https origin> | --resume | --abandon [--state <folder>]")
	}

	target, err := resolveTarget()
	if err != nil {
		return err
	}
	root := target.root
	connection := projectConnection{
		state:     host.ConnectionState{Folder: *stateFolder, CanonicalRoot: root},
		origin:    *origin,
		transport: &http.Client{Timeout: 30 * time.Second},
	}
	if *abandon {
		return connection.abandon(context.Background(), os.Stdout)
	}
	installation, err := ownInstallation()
	if err != nil {
		return err
	}

	var binding host.Binding
	if *resume {
		binding, err = connection.resume(context.Background())
	} else {
		binding, err = connection.redeemConfirmed(target, installation)
	}
	if err != nil {
		return err
	}

	// Only a report of this run's setup, acknowledged after it began, makes the folder ready.
	started := time.Now()
	if err := connection.setUp(binding, installation); err != nil {
		return err
	}
	setupGeneration := project.Folder{Root: root}.SetupGeneration()
	program, err := os.Executable()
	if err != nil {
		return err
	}
	if err := host.StartRelay(program, *stateFolder, binding.BindingID); err != nil {
		return err
	}
	dispatcher := filepath.Join(installation.Folder, "bin", "journal")
	if !awaitReady(connection.state, binding.BindingID, setupGeneration, started, relayReadyWait) {
		fmt.Printf("Enrolled with %s. Waiting for first contact.\n  binding: %s\n  check it with: %q status\n",
			binding.JournalURL, binding.BindingID, dispatcher)
		return errFirstContactPending
	}

	fmt.Printf("Ready: %s answered this folder's relay.\n  project: %s\n  binding: %s\n  machine: %s\n",
		binding.JournalURL, binding.ProjectLabel, binding.BindingID, host.MachineLabel())

	return nil
}

// redeemConfirmed checks and confirms the folder, so a refusal leaves the line unspent, prints the ticket-free command
// that finishes the install if this run is cut short, and redeems the line read from standard input.
func (connection projectConnection) redeemConfirmed(target targetFolder, installation host.Installation) (host.Binding, error) {
	ticket, err := readTicket(os.Stdin)
	if err != nil {
		return host.Binding{}, err
	}
	if err := target.assertNotConnected(connection.state, os.Stdout); err != nil {
		return host.Binding{}, err
	}
	if err := target.checkIdentity(connection.state, os.Stdout); err != nil {
		return host.Binding{}, err
	}
	if err := target.confirm(connection.origin, os.Stdout); err != nil {
		return host.Binding{}, err
	}
	fmt.Printf("journal: if this stops before it ends, finish it in %s with: %q connect --resume\n",
		target.root, filepath.Join(installation.Folder, "bin", "journal-agent"))

	return connection.redeem(context.Background(), ticket)
}

// errFirstContactPending is the end of a connect whose binding and setup are saved but whose relay the journal has
// not acknowledged yet; it exits with code 2, so the installer can tell it from a failure.
var errFirstContactPending = exitCodeError{
	code:    2,
	message: "the folder is enrolled, and the journal has not heard from its relay yet",
}

// exitCodeError ends a command with its own exit code rather than 1.
type exitCodeError struct {
	code    int
	message string
}

func (failure exitCodeError) Error() string { return failure.message }

// projectConnection redeems one folder's install line against one journal.
type projectConnection struct {
	state     host.ConnectionState
	origin    string
	transport *http.Client
}

// redeem stages the folder's credential and nonce, redeems the ticket and keeps the binding. A reply that was lost,
// in this run or an earlier one, is recovered with the staged credential instead of redeeming again.
func (connection projectConnection) redeem(ctx context.Context, ticket string) (host.Binding, error) {
	unlock, err := connection.state.Lock()
	if err != nil {
		return host.Binding{}, err
	}
	defer unlock()

	binding, err := connection.state.Binding()
	if err == nil {
		return binding, nil
	}
	if !errors.Is(err, host.ErrNotConnected) {
		return host.Binding{}, err
	}

	pending, err := connection.state.Pending(connection.origin)
	if err != nil {
		return host.Binding{}, err
	}

	redemption, err := client.Redeem(ctx, connection.transport, pending.Origin, redeemRequest(ticket, pending))
	if err != nil {
		redemption, err = connection.recover(ctx, pending, err)
	}
	if err != nil {
		return host.Binding{}, err
	}

	return connection.keep(redemption, pending)
}

// keep saves the binding a redemption, or its recovery, made from the staged connection, which it drops.
func (connection projectConnection) keep(redemption client.Redemption, pending host.PendingConnection) (host.Binding, error) {
	enrollment := host.Enrollment{
		JournalURL: originOf(redemption, pending),
		HostID:     redemption.HostID,
		Secret:     pending.HostCredential,
	}
	binding := host.Binding{
		Enrollment:    enrollment,
		ProjectID:     redemption.ProjectID,
		ProjectLabel:  redemption.ProjectLabel,
		BindingID:     redemption.BindingID,
		MainAgentID:   redemption.MainAgentID,
		RootID:        pending.RootID,
		CanonicalRoot: pending.CanonicalRoot,
	}

	return binding, connection.state.SaveBinding(binding)
}

// setUp writes the folder's .journal setup for the binding under the root's lock; a rerun finishes what an
// interrupted one left.
func (connection projectConnection) setUp(binding host.Binding, installation host.Installation) error {
	unlock, err := connection.state.Lock()
	if err != nil {
		return err
	}
	defer unlock()

	folder := project.Folder{Root: connection.state.CanonicalRoot}

	return folder.SetUp(project.ConnectionOf(binding), installation)
}

// ownInstallation is the sealed installation this program runs from: the folder above its bin folder.
func ownInstallation() (host.Installation, error) {
	program, err := os.Executable()
	if err != nil {
		return host.Installation{}, err
	}
	program, err = filepath.EvalSymlinks(program)
	if err != nil {
		return host.Installation{}, err
	}

	return host.Installation{Folder: filepath.Dir(filepath.Dir(program))}, nil
}

// recover asks for the binding the staged nonce made after a redemption that failed: a lost reply, or a ticket an
// earlier run of this folder already spent. When nothing is recovered, the redemption's own refusal stands.
func (connection projectConnection) recover(
	ctx context.Context,
	pending host.PendingConnection,
	redeemFailure error,
) (client.Redemption, error) {
	redemption, err := connection.committedRedemption(ctx, pending)
	if err == nil {
		return redemption, nil
	}
	if errors.Is(redeemFailure, client.ErrUncertain) || errors.Is(err, client.ErrUncertain) {
		return client.Redemption{}, errors.Join(redeemFailure, err)
	}

	return client.Redemption{}, errLineUnusable
}

func redeemRequest(ticket string, pending host.PendingConnection) client.RedeemRequest {
	return client.RedeemRequest{
		Ticket:            ticket,
		InstallationNonce: pending.InstallationNonce,
		HostCredential:    pending.HostCredential,
		RootID:            pending.RootID,
		CanonicalRoot:     pending.CanonicalRoot,
		ProjectLabel:      filepath.Base(pending.CanonicalRoot),
		MachineLabel:      host.MachineLabel(),
	}
}

// originOf is the canonical origin the journal answered, or the one the relay was given when it answered none.
func originOf(redemption client.Redemption, pending host.PendingConnection) string {
	if redemption.CanonicalOrigin == "" {
		return pending.Origin
	}

	return redemption.CanonicalOrigin
}

// readTicket is the first line of standard input, trimmed.
func readTicket(input *os.File) (string, error) {
	line, err := bufio.NewReader(input).ReadString('\n')
	ticket := strings.TrimSpace(line)
	if ticket == "" {
		return "", errors.Join(errTicketMissing, err)
	}

	return ticket, nil
}
