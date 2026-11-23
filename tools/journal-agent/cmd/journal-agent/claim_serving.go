package main

import (
	"context"
	"log"
	"strconv"
	"sync"

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
	starts := &claimedStarts{keys: map[string]string{}, report: func(report host.StartReport) {
		claims.executor.report(ctx, report)
	}}
	loop := serving.NewLoop(endedStarts{Journal: claims.journal, starts: starts}, claims.preparation,
		starts.opening(claims.open))
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

// claimedStarts keeps the start of each runtime the claim loop opened, to tell the journal that its program runs
// and, when its runtime ends, that it stopped, as a start made through the start socket is told: a start nobody
// reports running stays on Starting for its whole life, and one nobody reports stopped is never proven ended.
type claimedStarts struct {
	mutex  sync.Mutex
	keys   map[string]string
	report func(host.StartReport)
}

// opening opens a claimed runtime and reports its start running, under the host's name for the execution.
func (starts *claimedStarts) opening(open serving.Opener) serving.Opener {
	return func(runtimeID string, prepared host.PreparedStart) (serving.Runtime, error) {
		runtime, err := open(runtimeID, prepared)
		if err != nil {
			return nil, err
		}
		starts.mutex.Lock()
		starts.keys[runtimeID] = prepared.Claim.StartKey
		starts.mutex.Unlock()
		starts.report(host.StartReport{
			StartKey: prepared.Claim.StartKey, Kind: host.ReportRunning, Execution: executionOf(runtimeID, runtime),
		})

		return runtime, nil
	}
}

// ended reports the start of a runtime that ended as stopped; a runtime this loop never opened has none to report.
func (starts *claimedStarts) ended(runtimeID string) {
	starts.mutex.Lock()
	key, opened := starts.keys[runtimeID]
	delete(starts.keys, runtimeID)
	starts.mutex.Unlock()
	if opened {
		starts.report(host.StartReport{StartKey: key, Kind: host.ReportStopped})
	}
}

// endedStarts is the loop's journal with one addition: a runtime's reported exit also ends its start.
type endedStarts struct {
	serving.Journal
	starts *claimedStarts
}

func (journal endedStarts) ReportExit(ctx context.Context, report client.LivenessReport) error {
	err := journal.Journal.ReportExit(ctx, report)
	journal.starts.ended(report.RuntimeID)

	return err
}

// executionOf is the host's name for one run of a runtime's program: the runtime and its process generation.
func executionOf(runtimeID string, runtime serving.Runtime) string {
	return runtimeID + ":" + strconv.Itoa(runtime.Generation())
}

// answerProjectRead reads what the journal asked for and reports it once; a report that fails is logged and left for
// the journal to expire.
func (claims claimServing) answerProjectRead(ctx context.Context, reader host.ProjectReader, read client.ProjectRead) {
	if err := claims.journal.ReportProjectRead(ctx, read.ID, reader.Answer(read)); err != nil {
		log.Printf("the answer to project read %s could not be sent: %v", read.ID, err)
	}
}
