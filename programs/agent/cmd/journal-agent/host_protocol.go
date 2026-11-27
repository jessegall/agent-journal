package main

import (
	"context"
	"errors"
	"flag"
	"io"
	"log"
	"maps"
	"os"
	"os/signal"
	"syscall"
	"time"

	"journal-agent/client"
	"journal-agent/host"
	"journal-agent/hostapi"
)

// developmentCommands are the subcommands only a development build carries, such as the mock Docker daemon;
// a release build has none.
var developmentCommands = map[string]func([]string) error{}

// protocolOnly runs host protocol 1 alone, without the serving loop; the suite's real-host harness starts it.
func protocolOnly(arguments []string) error {
	flags := flag.NewFlagSet("protocol", flag.ContinueOnError)
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	dockerSocket := flags.String("docker", "", "the agent daemon's socket the host opens containers through")
	installation := flags.String("installation", "", "the protected installation saved-account starts run from")
	hookCommand := flags.String("hook-command", "", "the hook relay command the drivers call")
	arrangementFlag := flags.String("arrangement", string(host.Local), "where agents run: local or contained")
	installationName := flags.String("installation-name", "", "the prefix of a contained host's containers")
	agentImage := flags.String("agent-image", "", "the agent image a contained host runs")
	untilInputEnds := flags.Bool("until-input-ends", false, "stop once standard input ends, as when the process that started it died")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	arrangement, err := host.ParseArrangement(*arrangementFlag)
	if err != nil {
		return err
	}
	installationPrefix, err := host.ParseInstallationName(*installationName)
	if err != nil {
		return err
	}
	enrollment, err := (host.State{Folder: *stateFolder}).Load()
	if err != nil {
		return err
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	if *untilInputEnds {
		stopWhenInputEnds(stop)
	}
	containers := host.Containers{}
	if *dockerSocket != "" {
		rules := host.ContainerRules{Arrangement: arrangement, InstallationName: installationPrefix, AgentImage: *agentImage,
			Allowed: host.NewAllowedImages()}
		containers, err = host.ContainersOn(*dockerSocket, rules)
		if err != nil {
			return err
		}
	}
	journal := client.New(enrollment).WithArrangement(string(arrangement))
	if err := hostapi.CheckOrigin(journal.JournalURL(), *dockerSocket != ""); err != nil {
		return err
	}
	if _, err := startHostProtocol(ctx, journal, enrollment, *stateFolder, hostNamesOf(journal, *installation, *hookCommand), containers,
		"development", hostProtocolOptions{}); err != nil {
		return err
	}
	<-ctx.Done()
	return nil
}

// stopWhenInputEnds stops once standard input ends: a harness that started this keeps the pipe open, so this ends
// with the harness even when it was killed and could stop nothing.
func stopWhenInputEnds(stop func()) {
	go func() {
		_, _ = io.Copy(io.Discard, os.Stdin)
		stop()
	}()
}

// startHostProtocol runs host protocol 1: process reports and output kept and sent, orders claimed through the long
// poll and carried out, the inventory sent once and a heartbeat every 30 s; extra executors carry out the orders only
// this host takes, such as a relay's project reads; idle keeps the idle window the claim answers name, for a host that
// leaves when idle. It answers the table of the processes it runs.
// hostProtocolOptions are what differs between the hosts that speak protocol 1: the orders a host carries out beside
// the common ones, the idle window that ends a relay, and the programs a connected host alone may open.
type hostProtocolOptions struct {
	Extra   map[string]hostapi.Executor
	Idle    *hostapi.IdleWindow
	Allowed *hostapi.AllowedPrograms
}

func startHostProtocol(ctx context.Context, journal *client.Client, enrollment host.Enrollment, stateFolder string,
	names map[string]string, containers host.Containers, release string, options hostProtocolOptions,
) (*hostapi.ProcessTable, error) {
	calls := hostapi.Journal{Client: journal}
	reports, err := hostapi.OpenReportQueue(stateFolder, func(report hostapi.ProcessReport) error {
		return calls.NotifyProcessReport(ctx, report)
	})
	if err != nil {
		return nil, err
	}
	record, err := hostapi.OpenAnsweredRecord(stateFolder)
	if err != nil {
		return nil, err
	}
	outputs := hostapi.NewOutputs(stateFolder, func(processID string, output hostapi.Output) error {
		return calls.NotifyProcessOutput(ctx, processID, output)
	}, time.Now)
	table := hostapi.OpenProcessTable(stateFolder, containers, reports, outputs)
	table.NameHost(names)
	if options.Allowed != nil {
		table.AllowOnly(options.Allowed)
	}
	if err := table.Adopt(ctx); err != nil {
		return nil, err
	}
	executors := table.Executors()
	maps.Copy(executors, hostapi.NewProcessInput(table, outputs, calls.PrivateValue).Executors())
	maps.Copy(executors, options.Extra)
	clock := &hostapi.JournalClock{Host: time.Now}
	verifier := hostapi.Verifier{Secret: hostapi.OrderSecretOf(enrollment.Secret), Now: clock.Now}
	dispatcher := hostapi.NewDispatcher(verifier, record, executors, func(order hostapi.Order, answer hostapi.Answer) {
		go func() {
			if err := calls.AnswerUntilTaken(ctx, answer, time.Second, order.ExpiresAt); err != nil {
				log.Printf("the answer to order %s was not sent: %v", answer.OrderID, err)
			}
		}()
	})
	relay := hostapi.Relay{Journal: calls, Dispatcher: dispatcher, Record: record, Table: table, Release: release,
		Heartbeat: hostapi.HeartbeatInterval, RetryAfter: time.Second, Clock: clock, Idle: options.Idle}
	go reports.Run(ctx.Done())
	if err := relay.SendInventory(ctx); err != nil {
		log.Printf("the host's inventory was not sent: %v", err)
	}
	go relay.Beat(ctx)
	go func() {
		if err := relay.Claim(ctx); err != nil && !errors.Is(err, context.Canceled) {
			log.Printf("host protocol 1 stopped: %v", err)
		}
	}()
	return table, nil
}

// hostNamesOf are the names a plan may ask this host for: the journal's URL as this host reaches it, the host's own
// binary, which a driver's status line runs as its reader, the protected installation account starts run from and the
// hook relay command the drivers call.
func hostNamesOf(journal *client.Client, installation, hookCommand string) map[string]string {
	names := map[string]string{"JOURNAL_URL": journal.JournalURL()}
	if installation != "" {
		names["INSTALLATION"] = installation
	}
	if hookCommand != "" {
		names["HOOK_COMMAND"] = hookCommand
	}
	if executable, err := os.Executable(); err == nil {
		names["JOURNAL_AGENT"] = executable
	}
	return names
}
