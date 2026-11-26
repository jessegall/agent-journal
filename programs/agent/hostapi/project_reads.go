package hostapi

import (
	"context"
	"encoding/json"

	"journal-agent/client"
	"journal-agent/host"
)

// ProjectReads carries out read_project orders on a connected project's folder: the read is answered on its own
// report, which the journal keeps for the agent that asked.
type ProjectReads struct {
	Reader  host.ProjectReader
	Journal *client.Client
}

// Executors are the order types project reads carry out.
func (reads ProjectReads) Executors() map[string]Executor {
	return map[string]Executor{"read_project": reads.read}
}

func (reads ProjectReads) read(ctx context.Context, order Order) (map[string]any, error) {
	var read client.ProjectRead
	if err := json.Unmarshal([]byte(order.Payload), &read); err != nil || read.ID == "" {
		return nil, RefusalError{Refusal: Unsafe, Reason: "the read_project order names no project read"}
	}
	if err := reads.Journal.NotifyProjectRead(ctx, read.ID, reads.Reader.Answer(read)); err != nil {
		return nil, err
	}
	return map[string]any{}, nil
}
