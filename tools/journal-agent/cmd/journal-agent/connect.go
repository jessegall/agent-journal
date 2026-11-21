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
// from an argument; the host credential is made here, kept in the private state folder and never printed.
func connect(arguments []string) error {
	flags := flag.NewFlagSet("connect", flag.ContinueOnError)
	ticketStdin := flags.Bool("ticket-stdin", false, "read the install line's ticket from standard input")
	origin := flags.String("origin", "", "the journal's canonical https origin")
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if !*ticketStdin || *origin == "" {
		return fmt.Errorf("usage: journal-agent connect --ticket-stdin --origin <https origin> [--state <folder>]")
	}

	ticket, err := readTicket(os.Stdin)
	if err != nil {
		return err
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
	// The folder is checked and confirmed before the line is redeemed, so a refusal leaves it usable.
	if err := target.assertNotConnected(connection.state, os.Stdout); err != nil {
		return err
	}
	if err := target.confirm(*origin, os.Stdout); err != nil {
		return err
	}
	binding, err := connection.redeem(context.Background(), ticket)
	if err != nil {
		return err
	}
	installation, err := ownInstallation()
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
	if !awaitReady(connection.state, binding.BindingID, setupGeneration, started, relayReadyWait) {
		fmt.Println("Connected, setup pending: this folder's relay has not reported yet. Run the install line again to finish.")
		return nil
	}

	fmt.Printf("Connected to %s · %s · %s\n", binding.JournalURL, filepath.Base(root), host.MachineLabel())

	return nil
}

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

	enrollment := host.Enrollment{
		JournalURL: originOf(redemption, pending),
		HostID:     redemption.HostID,
		Secret:     pending.HostCredential,
	}
	binding = host.Binding{
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

	return folder.SetUp(project.ConnectionOf(binding, client.RemoteProjectProtocolVersion), installation)
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
	enrollment := host.Enrollment{JournalURL: pending.Origin, Secret: pending.HostCredential}
	staged := client.ForRemoteProject(enrollment, connection.transport)
	redemption, err := staged.Recover(ctx, pending.InstallationNonce)
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
		Protocol:          client.RemoteProjectProtocolVersion,
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
