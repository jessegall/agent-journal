package main

import (
	"context"
	"errors"
	"log"
	"maps"
	"time"

	"journal-agent/client"
	"journal-agent/host"
	"journal-agent/hostapi"
)

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
	table := hostapi.NewProcessTable(containers, reports, outputs)
	executors := table.Executors()
	maps.Copy(executors, hostapi.NewProcessInput(table, outputs).Executors())
	verifier := hostapi.Verifier{Secret: hostapi.OrderSecretOf(enrollment.Secret), Now: time.Now}
	dispatcher := hostapi.NewDispatcher(verifier, record, executors, func(answer hostapi.Answer) {
		if err := calls.AnswerOrder(ctx, answer); err != nil {
			log.Printf("the answer to order %s was not sent: %v", answer.OrderID, err)
		}
	})
	relay := hostapi.Relay{Journal: calls, Dispatcher: dispatcher, Record: record, Table: table, Release: release,
		Heartbeat: hostapi.HeartbeatInterval, RetryAfter: time.Second}
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
