package main

import (
	"bufio"
	"context"
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"journal-agent/client"
	"journal-agent/host"
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
	stateFolder := flags.String("state", defaultStateFolder(), "the host's private state folder")
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
	root, err := projectRoot()
	if err != nil {
		return err
	}

	connection := projectConnection{
		state:     host.ConnectionState{Folder: *stateFolder, CanonicalRoot: root},
		origin:    *origin,
		transport: &http.Client{Timeout: 30 * time.Second},
	}
	binding, err := connection.redeem(context.Background(), ticket)
	if err != nil {
		return err
	}

	fmt.Printf("Connected to %s: project %s, binding %s\n", binding.JournalURL, binding.ProjectID, binding.BindingID)

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
		Enrollment: enrollment,
		ProjectID:  redemption.ProjectID,
		BindingID:  redemption.BindingID,
		RootID:     pending.RootID,
	}

	return binding, connection.state.SaveBinding(binding)
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
	machine, err := os.Hostname()
	if err != nil {
		machine = "this machine"
	}

	return client.RedeemRequest{
		Ticket:            ticket,
		InstallationNonce: pending.InstallationNonce,
		HostCredential:    pending.HostCredential,
		RootID:            pending.RootID,
		CanonicalRoot:     pending.CanonicalRoot,
		ProjectLabel:      filepath.Base(pending.CanonicalRoot),
		MachineLabel:      machine,
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

// projectRoot is the canonical root of the folder this runs in: the top of its Git checkout, or the folder itself
// outside one, with every link resolved.
func projectRoot() (string, error) {
	folder, err := os.Getwd()
	if err != nil {
		return "", err
	}
	if printed, err := exec.Command("git", "-C", folder, "rev-parse", "--show-toplevel").Output(); err == nil {
		folder = strings.TrimSpace(string(printed))
	}

	return filepath.EvalSymlinks(folder)
}
