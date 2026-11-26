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

// developmentCommands are the subcommands only a development build carries, such as the stand-in Docker daemon;
// a release build has none.
var developmentCommands = map[string]func([]string) error{}

// protocolOnly runs host protocol 1 alone, without the older serving loop: what serve becomes once phase 4 removes
// that loop, and what the suite's real-host harness starts.
func protocolOnly(arguments []string) error {
	flags := flag.NewFlagSet("protocol", flag.ContinueOnError)
	stateFolder := flags.String("state", host.DefaultStateFolder(), "the host's private state folder")
	dockerSocket := flags.String("docker", "", "the agent daemon's socket the host opens containers through")
	untilInputEnds := flags.Bool("until-input-ends", false, "stop once standard input ends, as when the process that started it died")
	if err := flags.Parse(arguments); err != nil {
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
		containers, err = host.ContainersOn(*dockerSocket, host.ContainerRules{Arrangement: host.Local})
		if err != nil {
			return err
		}
	}
	journal := client.New(enrollment)
	if err := hostapi.CheckOrigin(journal.JournalURL(), *dockerSocket != ""); err != nil {
		return err
	}
	if err := startHostProtocol(ctx, journal, enrollment, *stateFolder, containers, "development"); err != nil {
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

// startHostProtocol runs host protocol 1 beside the older serving loop: process reports and output kept and sent,
// orders claimed through the long poll and carried out, the inventory sent once and a heartbeat every 30 s.
func startHostProtocol(ctx context.Context, journal *client.Client, enrollment host.Enrollment, stateFolder string,
	containers host.Containers, release string) error {
	calls := hostapi.Journal{Client: journal}
	reports, err := hostapi.OpenReportQueue(stateFolder, func(report hostapi.ProcessReport) error {
		return calls.NotifyProcessReport(ctx, report)
	})
	if err != nil {
		return err
	}
	record, err := hostapi.OpenAnsweredRecord(stateFolder)
	if err != nil {
		return err
	}
	outputs := hostapi.NewOutputs(stateFolder, func(processID string, output hostapi.Output) error {
		return calls.NotifyProcessOutput(ctx, processID, output)
	}, time.Now)
	table := hostapi.OpenProcessTable(stateFolder, containers, reports, outputs)
	if err := table.Adopt(ctx); err != nil {
		return err
	}
	executors := table.Executors()
	maps.Copy(executors, hostapi.NewProcessInput(table, outputs).Executors())
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
		Heartbeat: hostapi.HeartbeatInterval, RetryAfter: time.Second, Clock: clock}
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
	return nil
}
