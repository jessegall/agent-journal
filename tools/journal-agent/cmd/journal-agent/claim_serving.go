package main

import (
	"context"
	"log"

	"journal-agent/client"
	"journal-agent/host"
	"journal-agent/serving"
)

// claimServing carries out the work the journal hands a host: the start socket its starts are made through, the
// serving loop that opens each claimed runtime, and the claim poll that feeds it. The enrolled host and a connected
// project's relay both run it, each with its own client and arrangement.
type claimServing struct {
	journal     *client.Client
	preparation host.StartPreparation
	// open opens each claimed runtime: the opener's own on an enrolled host, one that keeps its lease on a relay.
	open              serving.Opener
	executor          *protectedExecutor
	startSocketFolder string
	socket            *host.AttachSocket
	// projectRoot is the folder of the project a relay serves, read for the journal's project reads; an enrolled
	// host has none and answers every read as unreadable.
	projectRoot string
}

// projectReadsAtOnce is how many project reads a host answers at the same time.
const projectReadsAtOnce = 4

// run serves claims until ctx ends or the journal refuses the protocol; claimed is told of every claim that handed
// work, so a relay can keep its binding online while there is any.
func (claims claimServing) run(ctx context.Context, claimed func()) error {
	startSocket := host.StartSocket{Folder: claims.startSocketFolder, Executor: claims.executor}
	startListener, err := startSocket.Listen()
	if err != nil {
		return err
	}
	defer startListener.Close()
	go startSocket.Serve(ctx, startListener)
	loop := serving.NewLoop(claims.journal, claims.preparation, claims.open)
	if err := loop.KeepUnsentReports(ctx, claims.startSocketFolder); err != nil {
		log.Printf("the request reports kept from before could not all be sent yet: %v", err)
	}
	watcher, err := host.NewScreenWatcher(ctx, claims.journal, claims.socket)
	if err != nil {
		return err
	}
	reader := host.ProjectReader{Root: claims.projectRoot}
	readsAtOnce := make(chan struct{}, projectReadsAtOnce)
	claims.journal.Poll(ctx, func(answer client.Claim) {
		watcher.Set(answer.Watched)
		for _, read := range answer.ProjectReads {
			readsAtOnce <- struct{}{}
			go func() {
				defer func() { <-readsAtOnce }()
				claims.answerProjectRead(ctx, reader, read)
			}()
		}
		if len(answer.Requests) == 0 {
			return
		}
		claimed()
		for _, request := range answer.Requests {
			log.Printf("claimed %s request %s (sequence %d, attempt %d) of runtime %s", request.Operation, request.RequestID, request.Sequence, request.Attempt, request.RuntimeID)
		}
		loop.Take(ctx, answer.Requests)
	})

	return nil
}

// answerProjectRead reads what the journal asked for and reports it once; a report that fails is logged and left for
// the journal to expire.
func (claims claimServing) answerProjectRead(ctx context.Context, reader host.ProjectReader, read client.ProjectRead) {
	if err := claims.journal.ReportProjectRead(ctx, read.ID, reader.Answer(read)); err != nil {
		log.Printf("the answer to project read %s could not be sent: %v", read.ID, err)
	}
}
