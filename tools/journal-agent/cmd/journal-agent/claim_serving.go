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
	journal           *client.Client
	preparation       host.StartPreparation
	opener            runtimeOpener
	executor          *protectedExecutor
	startSocketFolder string
	socket            *host.AttachSocket
}

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
	loop := serving.NewLoop(claims.journal, claims.preparation, claims.opener.open)
	watcher, err := host.NewScreenWatcher(ctx, claims.journal, claims.socket)
	if err != nil {
		return err
	}
	claims.journal.Poll(ctx, func(answer client.Claim) {
		watcher.Set(answer.Watched)
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
